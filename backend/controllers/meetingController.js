import pool from "../config/db.js";

export const getMeetings = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "id is not included!" });
    }
    const [response] = await pool.query(
      "SELECT * FROM relationships WHERE sender_id = ? OR receiver_id = ?",
      [id, id]
    );
    const { sender_id, receiver_id } = response[0];
    const [dates1] = await pool.query(
      "SELECT date FROM free_days WHERE user_id = ?",
      [sender_id]
    );
    const [dates2] = await pool.query(
      "SELECT date FROM free_days WHERE user_id = ?",
      [receiver_id]
    );
    const dates = dates1.filter((date1) => {
      const isMatch = dates2.some(
        (date2) =>
          new Date(date1.date).getTime() === new Date(date2.date).getTime()
      );
      return isMatch;
    });

    res.status(200).json({ dates });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addMeetings = async (req, res) => {
  try {
    const { id, date } = req.body;
    if (!id || !Number.isInteger(Number(id)) || !date) {
      return res.status(400).json({ error: "data is invalid!" });
    }
    const [coupleIdResponse] = await pool.query(
      "SELECT id FROM relationships WHERE sender_id = ? OR receiver_id = ?",
      [id, id]
    );
    if (coupleIdResponse.length === 0) {
      return res.status(400).json({ error: "user doesn't have a couple!" });
    }
    const coupleId = coupleIdResponse[0].id;

    const [meeting] = await pool.query(
      "SELECT id FROM meetings WHERE date = ?",
      [date]
    );

    if (meeting.length !== 0) {
      return res.status(400).json({
        error:
          "The couple has already registered an appointment for this time!",
      });
    }

    await pool.query("INSERT INTO meetings(couple_id, date) VALUES(?,?)", [
      coupleId,
      date,
    ]);
    return res.status(201).json({ message: "successfully added!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
