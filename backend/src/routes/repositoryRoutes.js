import express from "express";
import axios from "axios";
import Repository from "../models/Repository.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
    const { repoPath } = req.body;

    if (!repoPath || !repoPath.includes("/")) {
        return res.status(400).json({ message: "Invalid repository path. Use format 'owner/repo'." });
    }

    const [owner, name] = repoPath.split("/");

    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${name}`, {
            headers: { "User-Agent": "github-crm" }
        });

        const repoData = response.data;

        const existingRepo = await Repository.findOne({ owner, name, user: req.user });
        if (existingRepo) {
            return res.status(400).json({ message: "Repository already added." });
        }

        const newRepo = await Repository.create({
            owner,
            name,
            url: repoData.html_url,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: repoData.open_issues_count,
            created_at: repoData.created_at,
            user: req.user
        });

        res.status(201).json({ message: "Repository added successfully", repository: newRepo });
    } catch (error) {
        console.error("GitHub API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch repository data" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const repositories = await Repository.find({ user: req.user }).sort({ createdAt: -1 });

        res.json({ repositories });
    } catch (error) {
        console.error("Error fetching repositories:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const repository = await Repository.findOne({ _id: req.params.id, user: req.user });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Отримуємо актуальні дані з GitHub API
        const response = await axios.get(`https://api.github.com/repos/${repository.owner}/${repository.name}`, {
            headers: { "User-Agent": "github-crm" }
        });

        const updatedData = response.data;

        // Оновлюємо репозиторій
        repository.stars = updatedData.stargazers_count;
        repository.forks = updatedData.forks_count;
        repository.issues = updatedData.open_issues_count;
        repository.updatedAt = new Date();

        await repository.save();

        res.json({ message: "Repository updated successfully", repository });
    } catch (error) {
        console.error("Error updating repository:", error.message);
        res.status(500).json({ message: "Failed to update repository" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const repository = await Repository.findOneAndDelete({ _id: req.params.id, user: req.user });

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json({ message: "Repository deleted successfully", repository });
    } catch (error) {
        console.error("Error deleting repository:", error.message);
        res.status(500).json({ message: "Failed to delete repository" });
    }
});



export default router;
