import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema.js";

export const cartRouter = express.Router();
const db = createDB();

async function getOrCreateCart(userId) {
  let cart = await db.getOne("carts", { userId });
  if (!cart) {
    cart = await db.create("carts", { userId, products: [] });
  }
  return cart;
}

cartRouter.get("/", async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  res.status(200).json({ data: cart });
});

cartRouter.post("/", validateBody(addToCartSchema), async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await db.getById("products", productId);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }

  const cart = await getOrCreateCart(req.user.id);
  const existingItem = cart.products.find((p) => String(p.id) === String(productId));

  let newProducts;
  if (existingItem) {
    newProducts = cart.products.map((p) =>
      String(p.id) === String(productId)
        ? { ...p, quantity: p.quantity + quantity }
        : p
    );
  } else {
    newProducts = [
      ...cart.products,
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity,
      },
    ];
  }

  const updated = await db.update("carts", cart.id, { products: newProducts });
  res.status(200).json({ message: "product added to cart", data: updated });
});

cartRouter.patch("/:productId", validateBody(updateCartItemSchema), async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user.id);

  const exists = cart.products.some(
    (p) => String(p.id) === String(req.params.productId)
  );
  if (!exists) {
    return res.status(404).json({ error: "item not in cart" });
  }

  const newProducts = cart.products.map((p) =>
    String(p.id) === String(req.params.productId) ? { ...p, quantity } : p
  );

  const updated = await db.update("carts", cart.id, { products: newProducts });
  res.status(200).json({ message: "cart updated", data: updated });
});

cartRouter.delete("/:productId", async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  const newProducts = cart.products.filter(
    (p) => String(p.id) !== String(req.params.productId)
  );

  const updated = await db.update("carts", cart.id, { products: newProducts });
  res.status(200).json({ message: "product removed from cart", data: updated });
});