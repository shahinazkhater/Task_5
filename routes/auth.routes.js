import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";

export const authRouter = Router();

const db = createDB();

/*
  POST /auth/login

  Login endpoint
*/
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const errors = {};

  if (!email || !email.includes("@")) {
    errors.email = { errors: ["A valid email is required"] };
  }

  if (!password || password.length < 1) {
    errors.password = { errors: ["Password is required"] };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await db.getByField("users", "email", email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log("login error", err);

    res.status(500).json({
      error: "Something went wrong while logging in",
    });
  }
});

/*
  POST /auth/register

  Register endpoint
*/
authRouter.post("/register", async (req, res) => {
  const { username, email, password, password_confirmation } = req.body;

  const errors = {};

  if (!username || username.trim().length < 3) {
    errors.username = { errors: ["Username must be at least 3 characters"] };
  }

  if (!email || !email.includes("@")) {
    errors.email = { errors: ["A valid email is required"] };
  }

  if (!password || password.length < 6) {
    errors.password = { errors: ["Password must be at least 6 characters"] };
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = { errors: ["Passwords do not match"] };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await db.getByField("users", "email", email);

    if (existingUser) {
      return res.status(400).json({
        errors: {
          email: { errors: ["Email is already registered"] },
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.create("users", {
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully, you can now log in",
    });
  } catch (err) {
    console.log("register error", err);

    res.status(500).json({
      error: "Something went wrong while registering",
    });
  }
});

/*
  POST /auth/logout

  Logout endpoint
*/
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logged out successfully",
  });
});