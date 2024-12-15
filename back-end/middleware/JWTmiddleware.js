const passport = require('passport');


const requireAuth = passport.authenticate('jwt', { session: false });


const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};