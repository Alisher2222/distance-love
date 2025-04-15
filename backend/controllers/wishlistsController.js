import pool from "../config/db.js";

export const createWishlist = async (req, res) => {
  try {
    const { text, createdId, partnerId } = req.body;
    if (!text || !partnerId || !createdId) {
      return res.status(400).json({ error: "data is invalid!" });
    }
    await pool.query(
      "INSERT INTO wishlists(text, created_id, partner_id) VALUES (?, ?, ?)",
      [text, createdId, partnerId]
    );
    return res.status(201).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getWishlists = async (req, res) => {
  try {
    const coupleId = req.query.coupleId;
    if (!coupleId) {
      return res.status(400).json({ error: "ID is invalid!" });
    }
    const [response] = await pool.query(
      "SELECT sender_id, receiver_id FROM relationships WHERE id = ?",
      [coupleId]
    );
    const { sender_id, receiver_id } = response[0];
    const [wishlists] = await pool.query(
      "SELECT * FROM wishlists WHERE created_id = ? AND partner_id = ? OR created_id = ? OR partner_id = ?",
      [sender_id, receiver_id, receiver_id, sender_id]
    );
    res.status(200).json({ wishlists });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "data is invalid!" });
    }
    await pool.query("DELETE FROM wishes WHERE wishlist_id = ?", [id]);
    await pool.query("DELETE FROM wishlists WHERE id = ?", [id]);
    return res.status(200).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
