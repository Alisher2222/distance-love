import "../style/infoBar.css";
import { CircleAlert } from "lucide-react";
import { motion } from "motion/react";
function InfoBar({ message }) {
  return (
    <motion.div
      className="info__container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <CircleAlert size={64} color="#467fb0" />
      <div className="info__text">
        <p className="info__heading">INFO</p>
        <p className="info__description">{message}</p>
      </div>
    </motion.div>
  );
}

export default InfoBar;
