import pool from "../config/db.js";

export const addHobby = async (req, res) => {
  try {
    const { names } = req.body;
    if (!Array.isArray(names) || names.length === 0) {
      return req.status(400).json({ error: "invalid data!" });
    }

    const uniqueNames = [...new Set(names)];

    const [hobbies] = await pool.query(
      "SELECT name FROM hobbies WHERE name IN ?",
      [uniqueNames]
    );
    if (hobbies.length !== 0) {
      return req
        .status(400)
        .json({ error: "invalid such hobby is already exist!" });
    }
    const [result] = await pool.query("INSERT INTO hobbies(name) VALUES(?)", [
      name,
    ]);
    req.status(201).json({
      message: "the hobby is successfully added!",
      id: result.insertId,
    });
  } catch (error) {
    req.status(500).json({ error: error.message });
  }
};

export const getHobbies = async (req, res) => {
  try {
    const [hobbiesRow] = await pool.query("SELECT * FROM hobbies");
    res.status(200).json(hobbiesRow);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
