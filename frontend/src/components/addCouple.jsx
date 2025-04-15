import { Heart, Search, X } from "lucide-react";
import "./../style/addCouple.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRelationship, sendRequest } from "../store/relationshipsSlice";
import { useNavigate } from "react-router-dom";

export default function AddCouple({ setIsVisible }) {
  const [id, setId] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateCouple = async (id) => {
    try {
      if (!userId || !Number.isInteger(Number(id))) {
        return;
      }
      await dispatch(
        sendRequest({ senderId: userId, receiverId: id })
      ).unwrap();
      setIsVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsVisible(false)}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={() => setIsVisible(false)}>
          <X size={20} />
        </button>

        <Heart
          style={{
            stroke: "#f68cc4",
            fill: "#ffb6c1",
          }}
          size={32}
        />

        <p className="couple__header">Connect with Your Partner</p>
        <p className="couple__description">
          Enter your partner's ID to connect and start planning your moments
          together
        </p>
        <div className="couple__input__container">
          <p className="input__description">Partner ID</p>
          <div className="input">
            <Search size={16} color="grey" />
            <input
              type="text"
              className="input__place"
              placeholder="Enter your partner's ID"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </div>
        </div>
        <motion.button
          className="add__button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98, rotate: "2deg" }}
          onClick={() => handleCreateCouple(id)}
        >
          <Heart
            style={{
              stroke: "#edafe3",
              fill: "#eaa1de",
            }}
            size={16}
          />
          Send the request to your partner
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
