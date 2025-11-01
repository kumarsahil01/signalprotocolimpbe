import express from 'express';
import { registerDevice } from '../controllers/deviceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', requireAuth, registerDevice);

export default router;
