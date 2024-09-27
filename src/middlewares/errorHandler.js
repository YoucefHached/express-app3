const { ValidationError } = require("sequelize");

const error = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const errors = err.errors.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  res.status(500).json({ error: err.message });
};

module.exports = error;
