import { ScrollText, X } from "lucide-react";
import "./../style/addCouple.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWishlist, getWishlists } from "../store/wishlistsSlice";

export default function AddWishlist({ setIsVisible, IDs }) {
  const [text, setText] = useState("");

  const coupleId = useSelector((state) => state.relationships.coupleId);

  const dispatch = useDispatch();

  const handleCreateWishlist = async () => {
    const { partnerId, userId } = IDs;
    await dispatch(
      createWishlist({ text, createdId: userId, partnerId: partnerId })
    ).unwrap();
    await dispatch(getWishlists({ coupleId })).unwrap();
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

        <ScrollText
          style={{
            stroke: "#f68cc4",
            fill: "#ffb6c1",
          }}
          size={32}
        />

        <p className="couple__header">Add a New Wishlist</p>
        <p className="couple__description">
          Name your wishlist to organize your shared dreams ✨
        </p>
        <div className="couple__input__container">
          <p className="input__description">Wishlist Title</p>
          <div className="input">
            <input
              type="text"
              className="input__place"
              placeholder="e.g. Travel Goals"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
        </div>
        <motion.button
          className="add__button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98, rotate: "2deg" }}
          onClick={handleCreateWishlist}
        >
          Add Wishlist
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
