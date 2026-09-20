import express from "express";
import { createDB } from "../db.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";
import { validateBody } from "../middlewares/validateBody.js";
import { productSchema, productUpdateSchema } from "../schemas/product.schema.js";

export const productsRouter = express.Router();
const db = createDB();

productsRouter.get("/", async (req, res) => {
  const { search } = req.query;
  let products = await db.getAll("products");

  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  res.status(200).json({ data: products });
});

productsRouter.get("/:id", async (req, res) => {
  const product = await db.getById("products", req.params.id);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  res.status(200).json({ data: product });
});

productsRouter.post(
  "/",
  checkAuth,
  checkRole("merchant"),
  validateBody(productSchema),
  async (req, res) => {
    const { name, description, price, image } = req.body;
    const product = await db.create("products", {
      name,
      description,
      price,
      image: image || "",
    });
    res.status(201).json({ message: "product created successfully", data: product });
  }
);

productsRouter.patch(
  "/:id",
  checkAuth,
  checkRole("merchant"),
  validateBody(productUpdateSchema),
  async (req, res) => {
    const existing = await db.getById("products", req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "product not found" });
    }
    const updated = await db.update("products", req.params.id, req.body);
    res.status(200).json({ message: "product updated successfully", data: updated });
  }
);

productsRouter.delete("/:id", checkAuth, checkRole("merchant"), async (req, res) => {
  const existing = await db.getById("products", req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "product not found" });
  }
  await db.delete("products", req.params.id);
  res.status(200).json({ message: "product deleted successfully" });
});