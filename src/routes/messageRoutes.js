import express from "express";
import { sendMessage, fetchConversation, markMessageRead } from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js"; // middleware that validates JWT

const router = express.Router();

// Send new message (REST API)
router.post("/send", requireAuth, sendMessage);

// Fetch convo
router.get("/conversation/:targetId", requireAuth, fetchConversation);

// Mark a message as read
router.post("/read", requireAuth, markMessageRead);

export default router;
