import argon2 from 'argon2';

// hash a plain password
export const hashPassword = async (plainPassword) => {
  return argon2.hash(plainPassword);
};

// verify a plain password against a stored hash
export const verifyPassword = async (hashedPassword, plainPassword) => {
  return argon2.verify(hashedPassword, plainPassword);
};
