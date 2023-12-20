function authRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({error: 'Authorization token required'})
    }
    if (req.user.role !== role) {
      return res.status(401).json({ error: "you are not allowed " });
    }

    next();
  };
}

module.exports = {
  authRole,
};
