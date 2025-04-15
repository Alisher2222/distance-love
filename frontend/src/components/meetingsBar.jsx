import { useEffect, useState } from "react";
import "../style/meetingsBar.css";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { addMeeting, getMeetings } from "../store/meetingsSlice";

function MeetingsBar({ setisExitst }) {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(-1);
  const [choosedDate, setChoosedDate] = useState({});
  const id = useSelector((state) => state.auth.userId);

  const rawDates = useSelector((state) => state.meetings.dates) || [];

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
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return {
      date: day,
      month,
      time: `${hours}:${minutes}`,
      period,
    };
  }

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

  const dates = rawDates.map((date) => convertSQLDateToCustomFormat(date.date));

  useEffect(() => {
    if (id) {
      dispatch(getMeetings({ id }));
    }
  }, [id, dispatch]);

  const handleChoose = ({ index, date }) => {
    setClicked(index);
    setChoosedDate(convertToSQLDate(date));
  };

  const handleSubmit = async () => {
    try {
      dispatch(addMeeting({ id, date: choosedDate }));
      setisExitst(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log(choosedDate);
  }, [choosedDate]);
  return (
    <motion.div
      className="meeting__container"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <div className="meeting__container__top">Select a Meeting Time</div>
      <div className="meeting__container__bottom">
        <div className="meetings">
          {dates.length === 0 ? (
            <></>
          ) : (
            dates.map((date, index) => (
              <div
                key={index}
                className={
                  clicked === index ? "meeting__item__choosed" : "meeting__item"
                }
                onClick={() => handleChoose({ index, date })}
              >
                <p>
                  {date.month} {date.date}
                </p>
                <p>
                  {date.time} {date.period}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="meeting__buttons">
          <motion.button
            className="meeting__confirm__button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: "3deg" }}
            onClick={handleSubmit}
          >
            Confirm meeting
          </motion.button>
          <motion.button
            className="meeting__cancel__button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: "3deg" }}
            onClick={() => setisExitst(false)}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default MeetingsBar;
