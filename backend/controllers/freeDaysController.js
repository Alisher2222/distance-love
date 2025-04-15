import pool from "../config/db.js";

export const addFreeDays = async (req, res) => {
  try {
    const arrayDate = req.body.arrayDate;
    const id = req.body.id;

    if (!Array.isArray(arrayDate) || arrayDate.length === 0 || !id) {
      return res.status(400).json({ error: "Invalid data!" });
    }
    const values = arrayDate.map((date) => [id, date]);

    const query = "INSERT INTO free_days (user_id, date) VALUES ?";
    await pool.query(query, [values]);

    res.status(200).json({ message: "Dates added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFreeDays = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "Invalid data!" });
    }
    const [freeDays] = await pool.query(
      "SELECT * FROM free_days WHERE user_id = ?",
      [id]
    );
    res.status(200).json({ freeDays });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFreeDays = async (req, res) => {
  try {
    const id = req.body.id;
    const arrayDate = req.body.arrayDate;

    if (!Array.isArray(arrayDate) || arrayDate.length === 0 || !id) {
      return res.status(400).json({ error: "Invalid data!" });
    }

    const query = `
      DELETE FROM free_days
      WHERE user_id = ? AND date IN (?)
    `;
    await pool.query(query, [id, arrayDate]);

    res.status(200).json({ message: "Deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
