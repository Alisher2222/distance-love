import pool from "../config/db.js";

export const createRelationship = async (req, res) => {
  try {
    const { id1, id2 } = req.body;
    if (!Number.isInteger(Number(id1)) || !Number.isInteger(Number(id2)))
      return res.status(401).json({ error: "one of these IDs is invalid!" });

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ? OR id = ?",
      [id1, id2]
    );
    if (users.length !== 2)
      return res.status(401).json({ error: "one of these IDs is invalid!" });

    const [existingCouple] = await pool.query(
      "SELECT id FROM relationships WHERE (partner1_id = ? AND partner2_id = ?) OR (partner1_id = ? AND partner2_id = ?)",
      [id1, id2, id2, id1]
    );
    if (existingCouple.length > 0)
      return res.status(400).json({ error: "This couple already exists!" });

    const [couple] = await pool.query(
      "INSERT INTO relationships(partner1_id, partner2_id) VALUES (?,?)",
      [id1, id2]
    );
    res.status(201).json({
      message: "the couple is successfuly added!",
      id: couple.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !Number.isInteger(Number(id)))
      return res.status(401).json({ error: "id is invalid" });
    const [users] = await pool.query(
      "SELECT id FROM relationships WHERE id = ?",
      [id]
    );
    if (users.length !== 1)
      return req
        .status(401)
        .json({ error: "relationship with such id doesn't exist" });
    await pool.query("DELETE FROM relationships WHERE id = ?", [id]);
    res.status(201).json({ message: "relationship is successfully deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRelationshipData = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !Number.isInteger(Number(id)))
      return res.status(401).json({ error: "id is invalid" });
    const [users] = await pool.query(
      "SELECT id FROM relationships WHERE id = ?",
      [id]
    );
    if (users.length !== 1)
      return req
        .status(401)
        .json({ error: "relationship with such id doesn't exist" });
    const [relationships] = await pool.query(
      "SELECT partner1_id, partner2_id FROM relationships WHERE id = ?",
      [id]
    );
    const { partner1_id, partner2_id } = relationships[0];
    const [data] = await pool.query(
      "SELECT name, surname, email FROM users WHERE id = ? OR id = ?",
      [partner1_id, partner2_id]
    );
    res.status(200).json({ data });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
