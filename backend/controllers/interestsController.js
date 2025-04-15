import pool from "../config/db.js";

export const addIntersets = async (req, res) => {
  try {
    const hobbiesId = req.body.hobbies;
    const id = req.body.id;
    if (!Array.isArray(hobbiesId) || hobbiesId.length === 0) {
      return res.status(400).json({ error: "Invalid data!" });
    }
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "ID is invalid" });
    }
    const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(400).json({ error: "User ID is invalid" });
    }

    const values = hobbiesId.map((hobbyId) => [hobbyId, id]);

    await pool.query("INSERT INTO interests (hobby_id,user_id) VALUES ?", [
      values,
    ]);

    res.status(201).json({ message: "Hobbies added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getInterests = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "query is not included!" });
    }
    const [interests] = await pool.query(
      "SELECT hobby_id FROM interests WHERE user_id = ?",
      [id]
    );

    if (interests.length === 0) {
      return res
        .status(404)
        .json({ error: "No interests found for this user!" });
    }

    const IDs = interests.map((interest) => interest.hobby_id);

    if (IDs.length === 0) {
      return res
        .status(404)
        .json({ error: "No hobbies associated with the interests!" });
    }

    const [hobbies] = await pool.query(
      "SELECT * FROM hobbies WHERE id IN (?)",
      [IDs]
    );

    return res.status(200).json({ interests: hobbies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
