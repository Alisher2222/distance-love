import React, { useState } from "react";
import "../style/AddMemoryModal.css";

export default function AddMemoryModal({ isOpen, onClose, onSave }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [newStory, setNewStory] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ dateOfHistory: selectedDate, description: newStory });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add a New Memory</h2>
        <p className="modal-description">
          Capture a special moment in your relationship journey.
        </p>

        <div className="form-group">
          <label htmlFor="memory-date">Date</label>
          <input
            type="date"
            id="memory-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="memory-story">Your Memory</label>
          <textarea
            id="memory-story"
            placeholder="Describe your special moment together..."
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            maxLength={200}
          />
          <div className="char-count">{newStory.length}/200 characters</div>
        </div>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!newStory.trim() || !selectedDate || isSaving}
          >
            {isSaving ? "Saving..." : "Save Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}
