import React, { useEffect, useState } from "react";
import "../style/connectedProfile.css";
import AddMemoryModal from "./addMemoryModal";
import { useDispatch, useSelector } from "react-redux";
import {
  createRelationshipHistory,
  getRelationshipData,
} from "../store/relationshipsSlice";

export default function ConnectedProfile({ userId, coupleId }) {
  const dispatch = useDispatch();
  const { partnerData, sharedInterests, histories } = useSelector(
    (state) => state.relationships
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getRelationshipData({ userId, coupleId }));
  }, [dispatch, userId, coupleId]);
  const handleSaveMemory = async (newMemory) => {
    await dispatch(
      createRelationshipHistory({ ...newMemory, coupleId })
    ).unwrap();
    dispatch(getRelationshipData({ userId, coupleId }));
  };

  const formatDate = (sqlDate) => {
    const date = new Date(sqlDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="gradient-overlay" />
        <div className="profile-header">
          <div className="heart-container" />
          <h2 className="profile-title">You're Connected 💑</h2>
          <p className="profile-subtitle">
            Together with {partnerData?.name || ""} {partnerData?.surname || ""}
          </p>
        </div>

        <div className="profile-content">
          <div className="interests-section">
            <h3>Shared Interests</h3>
            <div className="interests-badges">
              {(sharedInterests || []).map((interest) => (
                <span
                  key={interest.id}
                  className={`badge badge-${interest.id % 3}`}
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </div>

          <hr className="divider" />

          <div className="history-section">
            <h3>Your Relationship History</h3>

            <div className="history-items">
              {(histories || []).map((item) => (
                <div
                  key={item.id}
                  className={`history-item history-${item.id % 3}`}
                >
                  {item.description} on {formatDate(item.date_of_history)}
                </div>
              ))}
            </div>
          </div>
          <div className="button-container">
            <button
              className="add-memory-button"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </div>
          <p className="footer-note">Keep growing your story together 💕</p>
        </div>
      </div>

      {/* Модалка */}
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMemory}
      />
    </div>
  );
}
