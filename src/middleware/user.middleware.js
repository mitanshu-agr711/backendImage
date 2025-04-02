import jwt from 'jsonwebtoken';
import User from '../models/User.js';

module.exports = async (req, res, next) => {
  try {

    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
  
    req.user = { id: user._id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
