import pool from "../config/db.js";
import { generateToken } from "../utilis/generateToken.js";
import { hashPassword } from "../utilis/hashPassword.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    const hashedPassword = await hashPassword(password);

    const [users] = pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length !== 0)
      return res
        .status(401)
        .json({ error: "user with such email is already exists!" });

    const [result] = await pool.query(
      "INSERT INTO users (name, surname, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, surname, email, hashedPassword, "user"]
    );

    res.status(201).json({
      message: "User successfully registered!",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.status(400).json({ error: "email or password is invalid" });

    const hashedPassword = rows[0].password;
    const isCorrect = bcrypt.compare(password, hashedPassword);

    if (!isCorrect)
      return res.status(400).json({ error: "email or password is invalid" });

    const { accessToken, refreshToken } = await generateToken(email);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true, security: false });
    res.status(200).json({ message: "successfully logouted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};