import { useState } from "react";
import "./../style/RelationshipInfo.css";

export default function RelationshipInfo() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const maxChars = 200;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Relationship Details</h2>
        <p className="card-description">
          Share information about your relationship journey
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="partner-name">Partner's Name</label>
          <input
            type="text"
            id="partner-name"
            placeholder="Enter your partner's name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="start-date">Relationship Start Date</label>
          <input
            type="date"
            id="start-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="description">Short Description</label>
            <span
              className={
                description.length > maxChars
                  ? "char-count error"
                  : "char-count"
              }
            >
              {description.length}/{maxChars}
            </span>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="We've been together for a year, living in different countries, but we call every evening and dream about the future."
            maxLength={maxChars + 10}
          />
        </div>

        <button className="save-button">Save Details</button>
      </div>
    </div>
  );
}
