import models from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signJWT } from '../utils/jwt.js';

const { User } = models;

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({ username, email, passwordHash });

    const token = signJWT(
        { sub: user.id, username: user.username, role: 'user' },
        { issuer: 'signalprotocolimpbe', audience: 'signalprotocolimpfe' }
        );
    res.status(201).json({
      message: 'User registered',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Credentials required' });
    }

    const user = await User.findOne({
      where: usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJWT(
  { sub: user.id, username: user.username, role: 'user' },
  { issuer: 'signalprotocolimpbe', audience: 'signalprotocolimpfe' }
);

    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};



// GET /api/auth/me
export const me = async (req, res) => {
  res.json({ userId: req.user.userId, username: req.user.username });
};
