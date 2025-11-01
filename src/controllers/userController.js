import models from '../models/index.js';
const { User } = models;


// Fetch all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: '❌ Failed to fetch users' });
  }
};
