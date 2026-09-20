import express from "express";
import { createDB } from "../db.js";

export const ordersRouter = express.Router();
const db = createDB();

ordersRouter.get("/", async (req, res) => {
  const allOrders = await db.getAll("orders");
  const myOrders = allOrders.filter((o) => String(o.userId) === String(req.user.id));
  res.status(200).json({ data: myOrders });
});

ordersRouter.post("/checkout", async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart || cart.products.length === 0) {
    return res.status(422).json({ error: "cart is empty" });
  }

  const total = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const order = await db.create("orders", {
    userId: req.user.id,
    products: cart.products,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  await db.update("carts", cart.id, { products: [] });

  res.status(201).json({ message: "order placed successfully", data: order });
});