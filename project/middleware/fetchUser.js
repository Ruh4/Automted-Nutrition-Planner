const jwt = require('jsonwebtoken');
const prisma = require('../db'); 

const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!req.user) {
      console.error('User not found for decoded token');
      return res.status(401).json({ error: 'Unauthorized - user not found' });
    }
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = fetchUser;
