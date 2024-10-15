import express from "express";
import { createAttribute, deleteAttribute, getAttributeById, getAttributes, updateAttribute } from "../controllers/attribute";

const router = express.Router();

//Định nghĩa route cho attribute
router.post("/attributes", createAttribute);
router.get("/attributes", getAttributes);
router.get("/attributes/:id", getAttributeById);
router.put("/attributes/:id", updateAttribute);
router.delete("/attributes/:id", deleteAttribute);

export default router;