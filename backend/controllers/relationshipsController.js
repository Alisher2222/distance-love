import pool from "../config/db.js";

export const sendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Both IDs are required!" });
    }

    const senderIdNum = parseInt(senderId, 10);
    const receiverIdNum = parseInt(receiverId, 10);

    if (!Number.isInteger(senderIdNum) || !Number.isInteger(receiverIdNum)) {
      return res.status(400).json({ error: "Invalid IDs provided!" });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ? OR id = ?",
      [senderIdNum, receiverIdNum]
    );

    if (users.length !== 2) {
      return res.status(400).json({ error: "One of these IDs is invalid!" });
    }

    const [checkForStatus] = await pool.query(
      "SELECT id FROM relationships WHERE status = 'active' AND (sender_id = ? OR receiver_id = ? OR sender_id = ? OR receiver_id = ?)",
      [senderIdNum, senderIdNum, receiverIdNum, receiverIdNum]
    );

    if (checkForStatus.length !== 0) {
      return res
        .status(400)
        .json({ error: "One of the users is already in a relationship!" });
    }

    await pool.query(
      "INSERT INTO relationships (sender_id, receiver_id, status) VALUES (?, ?, ?)",
      [senderIdNum, receiverIdNum, "pending"]
    );

    res.status(201).json({
      message: "The couple was successfully added!",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createRelationship = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Both IDs are required!" });
    }

    const senderIdNum = parseInt(senderId, 10);
    const receiverIdNum = parseInt(receiverId, 10);

    if (!Number.isInteger(senderIdNum) || !Number.isInteger(receiverIdNum)) {
      return res.status(400).json({ error: "Invalid IDs provided!" });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ? OR id = ?",
      [senderIdNum, receiverIdNum]
    );

    if (users.length !== 2) {
      return res.status(400).json({ error: "One of these IDs is invalid!" });
    }

    const [existingCouple] = await pool.query(
      "SELECT id FROM relationships WHERE (sender_id = ? AND receiver_id = ? AND status = ?) OR (sender_id = ? AND receiver_id = ? AND status = ?)",
      [
        senderIdNum,
        receiverIdNum,
        "pending",
        receiverIdNum,
        senderIdNum,
        "pending",
      ]
    );

    if (existingCouple.length === 0) {
      return res.status(400).json({ error: "This couple doesn't exist!" });
    }

    const [checkForStatus] = await pool.query(
      "SELECT id FROM relationships WHERE (sender_id = ? AND receiver_id = ? AND status = ?) OR (sender_id = ? AND receiver_id = ? AND status = ?)",
      [
        senderIdNum,
        receiverIdNum,
        "active",
        receiverIdNum,
        senderIdNum,
        "active",
      ]
    );

    if (checkForStatus.length !== 0) {
      return res
        .status(400)
        .json({ error: "One of the users is already in a relationship!" });
    }

    const coupleId = existingCouple[0].id;

    await pool.query("UPDATE relationships SET status = ? WHERE id = ?", [
      "active",
      coupleId,
    ]);

    res.status(200).json({ message: "success!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRelationshipId = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "id is not valid!" });
    }

    const [response] = await pool.query(
      "SELECT id FROM relationships WHERE (sender_id = ? OR receiver_id = ?) AND status = ?",
      [id, id, "active"]
    );

    if (response.length === 0) {
      return res
        .status(400)
        .json({ error: "The user doesn't have a partner!" });
    }

    const coupleId = response[0].id;
    return res.status(200).json({ coupleId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const id = req.query.id;
    const numericId = Number(id);

    if (!id || !Number.isInteger(numericId)) {
      return res.status(400).json({ error: "id is invalid!" });
    }

    const [userCheck] = await pool.query("SELECT id FROM users WHERE id = ?", [
      numericId,
    ]);

    if (userCheck.length === 0) {
      return res
        .status(400)
        .json({ error: "user with such id doesn't exist!" });
    }

    const [relationships] = await pool.query(
      "SELECT * FROM relationships WHERE sender_id = ? OR receiver_id = ?",
      [numericId, numericId]
    );

    const formattedData = [];

    for (const relationship of relationships) {
      const [senderInfo] = await pool.query(
        "SELECT name, surname FROM users WHERE id = ?",
        [relationship.sender_id]
      );

      const [receiverInfo] = await pool.query(
        "SELECT name, surname FROM users WHERE id = ?",
        [relationship.receiver_id]
      );

      formattedData.push([
        {
          relationship: {
            id: relationship.id,
            sender_id: relationship.sender_id,
            receiver_id: relationship.receiver_id,
            status: relationship.status,
          },
        },
        {
          sender: senderInfo[0] || {},
          receiver: receiverInfo[0] || {},
        },
      ]);
    }

    return res.status(200).json({ requests: formattedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Both IDs are required!" });
    }

    const senderIdNum = parseInt(senderId, 10);
    const receiverIdNum = parseInt(receiverId, 10);

    if (!Number.isInteger(senderIdNum) || !Number.isInteger(receiverIdNum)) {
      return res.status(400).json({ error: "Invalid IDs provided!" });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ? OR id = ?",
      [senderIdNum, receiverIdNum]
    );

    if (users.length !== 2) {
      return res.status(400).json({ error: "One of these IDs is invalid!" });
    }

    const [existingCouple] = await pool.query(
      "SELECT id FROM relationships WHERE (sender_id = ? AND receiver_id = ? AND status = ?) OR (sender_id = ? AND receiver_id = ? AND status = ?)",
      [
        senderIdNum,
        receiverIdNum,
        "pending",
        receiverIdNum,
        senderIdNum,
        "pending",
      ]
    );

    if (existingCouple.length === 0) {
      return res.status(400).json({ error: "This couple doesn't exist!" });
    }

    const coupleId = existingCouple[0].id;

    await pool.query("UPDATE relationships SET status = ? WHERE id = ?", [
      "reject",
      coupleId,
    ]);

    res.status(200).json({ message: "success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRelationshipData = async (req, res) => {
  try {
    const { coupleId, userId } = req.query;
    if (!coupleId || Number.isInteger(coupleId)) {
      return res.status(400).json({ error: "id is invalid" });
    }
    const [response] = await pool.query(
      "SELECT * FROM relationships WHERE id = ? AND status = ?",
      [coupleId, "active"]
    );
    if (response.length === 0) {
      return res
        .status(400)
        .json({ error: "relationship with such ID doesn't exist " });
    }
    let partnerId;
    const relationshipObject = response[0];
    const userIdNumber = parseInt(userId, 10);

    if (relationshipObject.sender_id == userIdNumber) {
      partnerId = relationshipObject.receiver_id;
    } else {
      partnerId = relationshipObject.sender_id;
    }
    const [partnerDataResponse] = await pool.query(
      "SELECT  name, surname, id FROM users WHERE id = ?",
      [partnerId]
    );
    const partnerData = partnerDataResponse[0];
    const [userInterests] = await pool.query(
      "SELECT * FROM interests WHERE user_id = ?",
      [userId]
    );
    const [partnerInterests] = await pool.query(
      "SELECT * FROM interests WHERE user_id = ?",
      [partnerId]
    );
    const interestsObjects = userInterests.filter((userInterest) => {
      return partnerInterests.some(
        (partnerInterest) => userInterest.hobby_id === partnerInterest.hobby_id
      );
    });
    const hobbiesID = interestsObjects.map((interest) => interest.hobby_id);
    let sharedInterests;
    if (hobbiesID.length === 0) {
      sharedInterests = [];
    } else {
      const placeholders = hobbiesID.map(() => "?").join(", ");

      const [sharedInterestsResponse] = await pool.query(
        `SELECT name, id FROM hobbies WHERE id IN (${placeholders})`,
        hobbiesID
      );

      sharedInterests = sharedInterestsResponse;
    }
    const [histories] = await pool.query(
      "SELECT * FROM relationships_histories WHERE couple_id = ?",
      [coupleId]
    );
    res.status(200).json({ partnerData, sharedInterests, histories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
