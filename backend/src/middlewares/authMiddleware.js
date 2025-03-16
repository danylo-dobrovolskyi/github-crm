import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
        console.error("🚨 No token or incorrect format");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const tokenValue = token.split(" ")[1];
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error("🚨 JWT Error:", error.message);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
