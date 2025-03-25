import pool from "../config/db.js";

export const getUserData = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(401).json({ error: "id is not included!" });
    const [rows] = await pool.query(
      "SELECT name, surname, email FROM users WHERE id = ?",
      [id]
    );
    const data = rows[0];
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
