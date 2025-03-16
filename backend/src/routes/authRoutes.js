import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: "User registered", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
