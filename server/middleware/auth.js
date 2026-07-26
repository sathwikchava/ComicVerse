const { clerkClient } = require('@clerk/clerk-sdk-node');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided. Please log in.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token using Clerk's SDK
    const decoded = await clerkClient.verifyToken(token);
    
    req.auth = decoded;
    req.userId = decoded.sub; // Clerk ID is mapped to sub
    next();
  } catch (error) {
    console.error('Clerk token verification error:', error.message);
    res.status(401).json({ message: 'Authentication failed. Invalid or expired session token.' });
  }
};

module.exports = auth;
