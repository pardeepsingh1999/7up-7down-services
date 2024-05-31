const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors?.isEmpty()) {
    return res.status(400).json({
      error: true,
      reasons: errors.array().map((err) => {
        if (err.type === "field") {
          return { message: err.msg, field: err.path };
        }
        return { message: err.msg };
      }),
    });
  }

  next();
};

module.exports = { validateRequest };
