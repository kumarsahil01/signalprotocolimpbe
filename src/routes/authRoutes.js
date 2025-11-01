// src/routes/authRoutes.js
import express from 'express';
import { register, login, me} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Get current logged-in user (protected)
router.get('/me', requireAuth, me);

export default router;
