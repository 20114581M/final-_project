const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect("mongodb+srv://servicesjmseptember_db_user:HwempoyKbcSbf00j@cluster0.yt5pl13.mongodb.net/aptech?retryWrites=true&w=majority", {
    serverSelectionTimeoutMS: 60000,
})
    .then(() => console.log("MongoDB connected Successfully"))
    .catch((err) => console.error("Connection failed:", err.message));

// ── User Schema ──
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "citizen" },
});

const User = mongoose.model("users", userSchema, "users");

// ── Report Schema ──
const reportSchema = new mongoose.Schema({
    submittedBy: { type: String, required: true },
    category: { type: String, required: true },
    urgency: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, default: null },
    status: { type: String, default: "pending" },
    trackingNumber: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("feedback", reportSchema, "feedback");

// ── Helper: decode token ──
function decodeToken(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    try {
        const token = authHeader.slice(7);
        return JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    } catch {
        return null;
    }
}

// ── Helper: generate tracking number ──
function generateTrackingNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RPT-${timestamp}-${random}`;
}

// ── Register ──
app.post("/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const newUser = await User.create({ fullName, email, password, role: "citizen" });

        const tokenPayload = { email: newUser.email, role: newUser.role };
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

        res.json({
            message: "Registration successful",
            token,
            user: { fullName: newUser.fullName, email: newUser.email, role: newUser.role },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Login ──
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const tokenPayload = { email: user.email, role: user.role };
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

        res.json({
            message: "Login successful",
            token,
            user: { fullName: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Submit Report ──
app.post("/report", async (req, res) => {
    try {
        const payload = decodeToken(req.headers.authorization);
        if (!payload) return res.status(401).json({ error: "Unauthorized. Please log in first." });

        const { category, urgency, title, location, description } = req.body;
        if (!category || !urgency || !title || !location || !description) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const trackingNumber = generateTrackingNumber();
        const report = await Report.create({
            submittedBy: payload.email,
            category,
            urgency,
            title,
            location,
            description,
            trackingNumber,
        });

        res.status(201).json({
            message: "Report submitted successfully.",
            trackingNumber: report.trackingNumber,
            reportId: report._id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Get Reports for the logged-in user only ──
app.get("/reports/my", async (req, res) => {
    try {
        const payload = decodeToken(req.headers.authorization);
        if (!payload) return res.status(401).json({ error: "Unauthorized. Please log in first." });

        const reports = await Report.find({ submittedBy: payload.email }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Get All Reports (admin use) ──
app.get("/reports", async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Update Report (admin: status + description) ──
app.patch("/reports/:id", async (req, res) => {
    try {
        const payload = decodeToken(req.headers.authorization);
        if (!payload) return res.status(401).json({ error: "Unauthorized. Please log in first." });
        if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden. Admins only." });

        const { status, description } = req.body;

        const allowedStatuses = ["pending", "in-progress", "resolved"];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value." });
        }

        const updateFields = {};
        if (status)      updateFields.status      = status;
        if (description) updateFields.description = description;

        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Report not found." });

        res.json({ message: "Report updated successfully.", report: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Delete Report (admin only) ──
app.delete("/reports/:id", async (req, res) => {
    try {
        const payload = decodeToken(req.headers.authorization);
        if (!payload) return res.status(401).json({ error: "Unauthorized. Please log in first." });
        if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden. Admins only." });

        const deleted = await Report.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Report not found." });

        res.json({ message: "Report deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));