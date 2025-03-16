import mongoose from "mongoose";

const RepositorySchema = new mongoose.Schema({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    stars: { type: Number, required: true },
    forks: { type: Number, required: true },
    issues: { type: Number, required: true },
    created_at: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Repository", RepositorySchema);
