import "./../style/errorBar.css";
import { Ban } from "lucide-react";
import { motion } from "motion/react";
function ErrorBar({ message }) {
  return (
    <motion.div
      className="errorBar__container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Ban color="#ba413f" size={64} />
      <div className="error__text">
        <p className="error__heading">Error!</p>
        <h1 className="error__description ">{message}</h1>
      </div>
    </motion.div>
  );
}

export default ErrorBar;
