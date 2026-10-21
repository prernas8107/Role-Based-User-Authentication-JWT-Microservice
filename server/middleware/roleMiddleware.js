//to check the required role for user
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.user ? req.user.role : 'Guest'}' does not have access to this resource`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
