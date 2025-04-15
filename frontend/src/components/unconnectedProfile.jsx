import { Heart, ArrowRight } from "lucide-react";
import "./../style/unconnectedProfile.css";
import { useState } from "react";
import AddCouple from "./addCouple";
import { AnimatePresence } from "motion/react";
export default function UnconnectedProfile() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="profile-wrapper">
      <div className="card">
        <div className="gradient-overlay" />
        <div className="card-header">
          <div className="icon-circle">
            <Heart size={24} className="heart-icon" />
          </div>
          <h2 className="card-title">Find Your Partner 💞</h2>
          <p className="card-description">
            To link your profiles, share your connection ID with your partner or
            enter theirs. Once you're connected, you'll see your shared
            relationship details here.
          </p>
        </div>

        <div className="card-content">
          <div className="placeholder-box">
            <div className="placeholder-text">
              <p>Your relationship details will appear here</p>
              <div className="dots">
                <span className="dot pink" />
                <span className="dot lavender" />
                <span className="dot blue" />
              </div>
            </div>
          </div>

          <button
            className="connect-button"
            onClick={() => setIsVisible(!isVisible)}
          >
            Connect to Partner
            <ArrowRight size={16} style={{ marginLeft: "0.5rem" }} />
          </button>

          <p className="note-text">
            Connection is required to unlock shared features like countdown
            timers, memory albums, and relationship milestones.
          </p>
        </div>
        <AnimatePresence>
          {isVisible && <AddCouple setIsVisible={setIsVisible} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
