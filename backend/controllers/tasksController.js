import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { text, mood, due_date, created_id, partner_id } = req.body;
    if (!text || !created_id) {
      return res.status(400).json({ error: "Required fields are missing!" });
    }
    await pool.query(
      "INSERT INTO tasks(text, mood, due_date, created_id, partner_id) VALUES(?, ?, ?, ?, ?)",
      [text, mood || null, due_date || null, created_id, partner_id || null]
    );
    res.status(201).json({ message: "Task created successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const createdId = req.query.created_id;
    const partnerId = req.query.partner_id;

    if (!createdId) {
      return res.status(400).json({ error: "created_id is required!" });
    }

    let query = "SELECT * FROM tasks WHERE created_id = ?";
    const params = [createdId];

    if (partnerId) {
      query += " OR partner_id = ?";
      params.push(partnerId);
    }

    const [tasks] = await pool.query(query, params);

    // Get user information for created_id and partner_id
    const userIds = tasks.reduce((ids, task) => {
      ids.add(task.created_id);
      if (task.partner_id) ids.add(task.partner_id);
      return ids;
    }, new Set());

    if (userIds.size > 0) {
      const [users] = await pool.query(
        `SELECT id, name, surname FROM users WHERE id IN (${Array.from(userIds)
          .map(() => "?")
          .join(",")})`,
        Array.from(userIds)
      );
      return res.status(200).json({ tasks, users });
    }

    res.status(200).json({ tasks, users: [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid task ID!" });
    }
    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid task ID!" });
    }

    await pool.query(
      "UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Task completion status toggled!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
