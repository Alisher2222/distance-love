import pool from "../config/db.js";

export const orgonizeMeeting = async (req, res) => {
  try {
    const { id, activity } = req.body;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(401).json({ error: "id is invalid!" });
    }
    const [couples] = await pool.query(
      "SELECT id FROM relationships WHERE id = ?",
      [id]
    );
    if (couples.length !== id) {
      return res
        .status(401)
        .json({ error: "relationship with such id doesn't exist!" });
    }
    const [result] = await pool.query(
      "INSET INTO meetings(relationship_id, activity) VALUES(?,?)",
      [id, activity]
    );
    res.status(201).json({message:"the meeting is successfully orgonized!"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
