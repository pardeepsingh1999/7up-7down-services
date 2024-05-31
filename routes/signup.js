const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const { validateRequest } = require("../middlewares");
const { User } = require("../models/user");

// `/api/v1`
const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: true, reason: "Email in use" });
      }

      const user = User.build({ email, password, points: 5000 });
      await user.save();

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY
      );

      res.status(201).send({ error: false, token: userJwt });
    } catch (error) {
      return res
        .status(400)
        .json({ error: true, reason: "Something went wrong" });
    }
  }
);

module.exports = router;
