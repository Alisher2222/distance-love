import pool from "../config/db.js";

export const createWish = async (req, res) => {
  try {
    const { description, createdId, wishlistId } = req.body;
    if (!description || !createdId) {
      return res.status(400).json({ error: "data is invalid!" });
    }
    await pool.query(
      "INSERT INTO wishes(description, created_id, wishlist_id) VALUES(?, ?, ?)",
      [description, createdId, wishlistId]
    );
    res.status(201).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getWishes = async (req, res) => {
  try {
    const id1 = req.query.id1;
    const id2 = req.query.id2;
    if (!id1 || !id2) {
      return res.status(400).json({ error: "id is invalid!" });
    }
    const [wishes] = await pool.query(
      "SELECT * FROM wishes WHERE  created_id= ? OR created_id = ?",
      [id1, id2]
    );
    const IDs = wishes.map((wish) => wish.created_id);

    const [users] = await pool.query(
      `SELECT name, surname, id FROM users WHERE id IN (${IDs.map(
        () => "?"
      ).join(",")})`,
      [...IDs]
    );

    res.status(200).json({ wishes, users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteWish = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "id is invalid!" });
    }
    await pool.query("DELETE FROM wishes WHERE id = ?", [id]);
    res.status(200).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
