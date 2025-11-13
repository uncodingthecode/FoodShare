import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
      isApproved: user.isApproved
    }
  });
};
