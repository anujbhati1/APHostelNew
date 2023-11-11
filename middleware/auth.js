import jwt from 'jsonwebtoken';

export const SECRET = 'SECr3t'; // This should be in an environment variable in a real application

export const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        console.error('Failed to authenticate token:', err.message);
        return res.json({
          success: false,
          message: 'You are not authorized.',
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'You are not authorized.',
    });
  }
};
