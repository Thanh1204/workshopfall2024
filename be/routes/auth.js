import express from "express";
import {
    signin,
    signup,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
} from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post(`/request-password-reset`, requestPasswordReset);
router.post(`/reset-password`, resetPassword);
router.get(`/current-user`, authMiddleware, getCurrentUser);

export default router;