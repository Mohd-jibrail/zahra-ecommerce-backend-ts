import express from "express";
import { signUp,signIn, signOut } from "../controllers/auth.controller.js";
export const authRoutes = express.Router();

authRoutes.route("/signUp").post(signUp);
authRoutes.route("/signIn").post(signIn);
authRoutes.route("/signOut").post(signOut)
