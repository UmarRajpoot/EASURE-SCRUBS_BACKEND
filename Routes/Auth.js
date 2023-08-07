import express from "express";
import Auth from "../Controllers/Auth.js";
const router = express.Router();

router.post("/register", Auth.Register);
router.post("/login", Auth.Login);

export default router;
