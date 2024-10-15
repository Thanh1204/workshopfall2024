import express from "express";
import { addItemToCart, decreaseProductQuantity, getCartByUserId, increaseProductQuantity, removeItemFromCart } from "../controllers/cart";

const router = express.Router();

router.get("/cart/:userId", getCartByUserId);
router.post("/cart", addItemToCart);
router.put("/cart/increase", increaseProductQuantity);
router.put("/cart/decrease", decreaseProductQuantity);
router.delete("/cart", removeItemFromCart);

export default router;