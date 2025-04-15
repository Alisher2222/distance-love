import { CakeSlice, X } from "lucide-react";
import "./../style/addCouple.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWish, getWishes } from "../store/wishesSlice";

export default function AddWish({ setIsVisible, wishlistId, IDs }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const createdId = useSelector((state) => state.auth.userId);

  const handleAddWish = async () => {
    const { created_id, partner_id } = IDs;
    await dispatch(
      createWish({ wishlistId, createdId, description: text })
    ).unwrap();
    await dispatch(getWishes({ id1: created_id, id2: partner_id })).unwrap();
    setIsVisible(false);
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

        <CakeSlice
          style={{
            stroke: "#f68cc4",
            fill: "#ffb6c1",
          }}
          size={32}
        />

        <p className="couple__header">Add a New Wish</p>
        <p className="couple__description">
          Name your wish to add it to your wishlist
        </p>
        <div className="couple__input__container">
          <p className="input__description">Wish Title</p>
          <div className="input">
            <input
              type="text"
              className="input__place"
              placeholder="e.g. Trip to Paris"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
        </div>
        <motion.button
          className="add__button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98, rotate: "2deg" }}
          onClick={handleAddWish}
        >
          Add to Wishlist
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
