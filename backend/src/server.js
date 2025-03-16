import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import connectDB from "./config/database.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server is running..." });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
