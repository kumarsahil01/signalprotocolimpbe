import express from 'express';
import { uploadKeys, getKeys } from '../controllers/keyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', requireAuth, uploadKeys);
router.get('/:userId', requireAuth, getKeys);

export default router;
