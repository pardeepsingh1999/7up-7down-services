const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const { validateRequest } = require("../middlewares");
const { User } = require("../models/user");
const { Password } = require("../services/password");

// `/api/v1`
const router = express.Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res
          .status(400)
          .json({ error: true, reason: "Invalid credentials" });
      }

      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );

      if (!passwordsMatch) {
        return res
          .status(400)
          .json({ error: true, reason: "Invalid credentials" });
      }

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY
      );

      res.status(200).send({ error: false, token: userJwt });
    } catch (error) {
      return res
        .status(400)
        .json({ error: true, reason: "Something went wrong" });
    }
  }
);

module.exports = router;
