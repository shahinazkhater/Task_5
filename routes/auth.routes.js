import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema } from "../schemas/auth/register.schema.js";
import { loginSchema } from "../schemas/auth/login.schema.js";

export const authRouter = express.Router();
const db = createDB();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const { username, email, password, role } = req.body;

  const existing = await db.getOne("auth_users", { email });
  if (existing) {
    return res
      .status(422)
      .json({ errors: { email: { errors: ["email already in use"] } } });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.create("auth_users", { username, email, passwordHash, role });

  res.status(201).json({ message: "register successful, you can now login" });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await db.getOne("auth_users", { email });
  if (!user) {
    return res.status(422).json({ error: "email or password are invalid" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(422).json({ error: "email or password are invalid" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("node_api_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "login successful",
    data: {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
    },
  });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("node_api_token");
  res.status(200).json({ message: "logout successful" });
});