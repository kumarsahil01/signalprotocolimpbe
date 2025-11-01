// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import {verifyJWT} from '../utils/jwt.js'

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = verifyJWT(token)
    req.user = decoded; // { userId / sub, username }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
