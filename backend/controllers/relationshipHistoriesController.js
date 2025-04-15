import pool from "../config/db.js";

export const createRelationshipHistory = async (req, res) => {
  try {
    const { coupleId, description, dateOfHistory } = req.body;
    console.log({ coupleId, description, dateOfHistory });
    if (
      !coupleId ||
      !Number.isInteger(Number(coupleId)) ||
      !description ||
      !dateOfHistory
    ) {
      return res.status(400).json({ error: "data is invalid" });
    }
    const [response] = await pool.query(
      "SELECT * FROM relationships WHERE id = ?",
      [coupleId]
    );
    if (response.length === 0) {
      return res
        .status(400)
        .json({ error: "relationship with such ID doesn't exist " });
    }
    await pool.query(
      "INSERT INTO relationships_histories (couple_id, description, date_of_history) VALUES(?, ?, ?)",
      [coupleId, description, dateOfHistory]
    );
    res.status(201).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
