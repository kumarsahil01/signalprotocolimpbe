import jwt from 'jsonwebtoken';

export const signJWT = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn, ...options }); // <-- return!
};

export const verifyJWT = (token, options = {}) => {
  return jwt.verify(token, process.env.JWT_SECRET, options);
};
