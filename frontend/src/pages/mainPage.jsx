import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Link } from "react-router-dom";
import "./../style/mainPage.css";
import { Sparkles, ClipboardList, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getRelationshipId } from "../store/relationshipsSlice";
import InfoBar from "../components/infoBar";
function MainPage() {
  const [doesHaveCouple, setDoesHaveCouple] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { userId, isAuthorized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const showAlert = () => {
    setShowInfo(true);
    setTimeout(() => {
      setShowInfo(false);
    }, 4000);
  };

  useEffect(() => {
    const fetchID = async () => {
      try {
        const reponse = await dispatch(
          getRelationshipId({ id: userId })
        ).unwrap();

        if (reponse?.coupleId) {
          setDoesHaveCouple(true);
        } else {
          setDoesHaveCouple(false);
          showAlert();
        }
      } catch (error) {
        console.error("Failed to fetch relationship:", error);
        setDoesHaveCouple(false);
        showAlert();
      }
    };

    fetchID();
  }, [userId]);

  return (
    <div className="layout">
      <Navbar />
      <Sidebar />
      <main className="content">
        <AnimatePresence>
          {isAuthorized && showInfo && (
            <InfoBar message="Dear user, in order to use some of the functions of the website, we recommend that you contact your partner in your profile section." />
          )}
        </AnimatePresence>
        <motion.div
          className="content__card"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.45 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="content__card__top">
            <Sparkles color="white" size={64} />
          </div>
          <div className="content__card__bottom">
            <p className="content__card__header">Wishlist</p>
            <p className="content__card__description">
              📌 Wishlist for Couples – A shared list for dreams and experiences
              (e.g., "Travel to Paris"). AI suggests ideas based on interests.
            </p>
            <Link className="content__card__button" to="/wishlist">
              Open wishlist
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="content__card"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="content__card__top"
            style={{
              background: "linear-gradient(to right, #398def, #2ecec3)",
            }}
          >
            <ClipboardList color="white" size={64} />
          </div>
          <div className="content__card__bottom">
            <p className="content__card__header">Todo list</p>
            <p className="content__card__description">
              📌 To-Do List – Assign fun tasks to each other (e.g., "Watch this
              movie before our call"), track progress, and leave sweet notes.
            </p>
            <Link
              className="content__card__button"
              style={{
                background: "linear-gradient(to right, #398def, #2ecec3)",
              }}
              to="/todolist"
            >
              Open todo list
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="content__card"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="content__card__top"
            style={{
              background: "linear-gradient(to right, #f5950b, #ea5f0c)",
            }}
          >
            <Users color="white" size={64} />
          </div>
          <div className="content__card__bottom">
            <p className="content__card__header">Smart Time Matching </p>
            <p className="content__card__description">
              📌 Smart Time Matching – Sync schedules to find the best time for
              calls and activities, with calendar integration.
            </p>
            <Link
              className="content__card__button"
              style={{
                background: "linear-gradient(to right, #f5950b, #ea5f0c)",
              }}
              to="/schedule"
            >
              Start time matching
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default MainPage;
