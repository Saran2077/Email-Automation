import jwt from './jwt.js';

const jwtInstance = new jwt();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwtInstance.verify(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 