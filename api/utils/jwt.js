import jwt from 'jsonwebtoken';

export const signToken = (userData) => {
  return jwt.sign(
    { userData },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
