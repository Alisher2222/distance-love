import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./../style/schedulePage.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addFreeDays,
  deleteFreeDays,
  getFreeDays,
} from "../store/freeDaysSlice";
import Navbar from "./navbar";
import MeetingsBar from "./meetingsBar";

function SchedulePage() {
  const [freeDays, setFreeDays] = useState([]);
  const [originalState, setOriginalState] = useState([]);
  const [deleteDays, setDeleteDays] = useState([]);
  const [addDays, setAddDays] = useState([]);
  const [isExist, setisExitst] = useState(false);
  const id = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return { time: displayHour.toString(), period };
  });
  function convertToSQLDate({ date, month, time, period }) {
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const year = new Date().getFullYear();
    let hour = parseInt(time, 10);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const paddedHour = String(hour).padStart(2, "0");
    const paddedDay = String(date).padStart(2, "0");
    const paddedMonth = monthMap[month];

    return `${year}-${paddedMonth}-${paddedDay} ${paddedHour}:00:00`;
  }

  const getDays = () => {
    const date = new Date();
    const months = [
      { id: 0, name: "Jan", days: 31 },
      { id: 1, name: "Feb", days: 28 },
      { id: 2, name: "Mar", days: 31 },
      { id: 3, name: "Apr", days: 30 },
      { id: 4, name: "May", days: 31 },
      { id: 5, name: "Jun", days: 30 },
      { id: 6, name: "Jul", days: 31 },
      { id: 7, name: "Aug", days: 31 },
      { id: 8, name: "Sep", days: 30 },
      { id: 9, name: "Oct", days: 31 },
      { id: 10, name: "Nov", days: 30 },
      { id: 11, name: "Dec", days: 31 },
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const year = date.getFullYear();
    let monthIndex = date.getMonth();
    let dayIndex = date.getDay();
    let currentDate = date.getDate();

    const isLeapYear = (year) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear(year)) months[1].days = 29;

    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      if (currentDate > months[monthIndex].days) {
        currentDate = 1;
        monthIndex = (monthIndex + 1) % 12;
      }

      next7Days.push({
        day: daysOfWeek[dayIndex],
        date: currentDate,
        month: months[monthIndex].name,
      });

      currentDate++;
      dayIndex = (dayIndex + 1) % 7;
    }

    return next7Days;
  };

  const days = getDays();

  const handleSchedule = ({ date, month, time, period }) => {
    const exists = freeDays.some(
      (day) =>
        Number(day.date) === Number(date) &&
        day.month.toLowerCase() === month.toLowerCase() &&
        Number(day.time) === Number(time) &&
        day.period === period
    );

    if (exists) {
      setFreeDays((prev) =>
        prev.filter(
          (day) =>
            !(
              Number(day.date) === Number(date) &&
              day.month.toLowerCase() === month.toLowerCase() &&
              Number(day.time) === Number(time) &&
              day.period === period
            )
        )
      );
      setDeleteDays((prev) => [...prev, { date, month, time, period }]);
    } else {
      setFreeDays((prev) => [...prev, { date, month, time, period }]);
      setAddDays((prev) => [...prev, { date, month, time, period }]);
    }
  };

  const isBusy = ({ date, month, time, period }) => {
    return freeDays.some(
      (day) =>
        Number(day.date) === Number(date) &&
        day.month.toLowerCase() === month.toLowerCase() &&
        Number(day.time) === Number(time) &&
        day.period === period
    );
  };

  function convertSQLDateToCustomFormat(sqlDate) {
    const date = new Date(sqlDate);

    const day = date.getDate();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getMonth()];

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
      hours -= 12;
    }
    if (hours === 0) {
      hours = 12;
    }

    return {
      date: day,
      month: month,
      time: hours.toString(),
      period: period,
    };
  }

  useEffect(() => {
    const fetchFreeDays = async () => {
      try {
        const data = (await dispatch(getFreeDays({ id })).unwrap()).freeDays;
        const arr = data.map((sqlDate) =>
          convertSQLDateToCustomFormat(sqlDate.date)
        );
        setFreeDays(arr);
        setOriginalState(arr);
      } catch (error) {
        console.error("Error while getting data", error);
      }
    };

    if (id) fetchFreeDays();
  }, []);

  const handleFindMeeting = async () => {
    const arrayAdd = addDays.filter((addItem) => {
      const isMatch = originalState.some(
        (origItem) =>
          Number(origItem.date) === Number(addItem.date) &&
          origItem.month.toLowerCase() === addItem.month.toLowerCase() &&
          Number(origItem.time) === Number(addItem.time) &&
          origItem.period === addItem.period
      );
      return !isMatch;
    });

    const arrayDelete = deleteDays.filter((deleteItem) => {
      const isMatch = originalState.some(
        (origItem) =>
          Number(origItem.date) === Number(deleteItem.date) &&
          origItem.month.toLowerCase() === deleteItem.month.toLowerCase() &&
          Number(origItem.time) === Number(deleteItem.time) &&
          origItem.period === deleteItem.period
      );
      return isMatch;
    });

    const datesToAdd = arrayAdd.map(convertToSQLDate);
    const datesToDelete = arrayDelete.map(convertToSQLDate);

    const uniqueAddDates = [...new Set(datesToAdd)];
    const uniqueDeleteDates = [...new Set(datesToDelete)];
    if (uniqueAddDates.length !== 0) {
      await dispatch(addFreeDays({ arrayDate: uniqueAddDates, id })).unwrap;
    }
    if (uniqueDeleteDates.length !== 0) {
      await dispatch(deleteFreeDays({ arrayDate: uniqueDeleteDates, id }))
        .unwrap;
    }
    setisExitst(true);
  };

  return (
    <>
      <Navbar />
      <div className="calendar__container">
        <div className="calendar">
          <p className="calendar__heading">Schedule Planner</p>
          <p>mark you're available times to find when you can meet</p>
          <div className="calendar__frame">
            <div className="day__line">
              <div className="day__container">
                <p className="day__of__week">Time</p>
              </div>
              {days.map((day, i) => (
                <div className="day__container" key={`day-header-${i}`}>
                  <p className="day__of__week">{day.day}</p>
                  <p className="day__month">
                    {day.date} {day.month}
                  </p>
                </div>
              ))}
            </div>

            {timeSlots.map((time, rowIdx) => (
              <div className="day__line" key={`time-row-${rowIdx}`}>
                <div className="day__container">
                  <p className="day__of__week">
                    {time.time} {time.period}
                  </p>
                </div>
                {days.map((day, colIdx) => (
                  <motion.div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={
                      isBusy({ ...day, ...time }) ? "busy__day" : "free__day"
                    }
                    onClick={() => handleSchedule({ ...day, ...time })}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1.4 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <motion.button
            onClick={handleFindMeeting}
            className="meeting__button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: "3deg" }}
          >
            Find optimal meeting times
          </motion.button>
          <AnimatePresence>
            {isExist && <MeetingsBar setisExitst={setisExitst} />}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default SchedulePage;
