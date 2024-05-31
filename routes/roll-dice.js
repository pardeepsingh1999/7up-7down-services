const { body } = require("express-validator");
const { validateRequest } = require("../middlewares");
const { User } = require("../models/user");

const express = require("express");

// `/api/v1`
const router = express.Router();

router.post(
  "/rolldice",
  [
    body("betAmount")
      .isFloat({ min: 100, max: 500 })
      .withMessage("Bet amount must be between 100 and 500."),
    body("betNumber")
      .isFloat({ min: 1, max: 12 })
      .withMessage("Bet number must be between 1 and 12."),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { betAmount, betNumber } = req.body;

      const user = await User.findById(req.user.id).exec();

      if (!user) {
        return res.status(401).json({ error: true, reason: "Not authorized" });
      }

      if (user.points < betAmount) {
        return res
          .status(400)
          .json({ error: true, reason: "You don't have enough points" });
      }

      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;

      const total = dice1 + dice2;

      let isWon = false;
      let isJackpot = false;

      if (total > 7) {
        if (betNumber > 7) {
          // won
          isWon = true;
        }
      } else if (total < 7) {
        if (betNumber < 7) {
          // won
          isWon = true;
        }
      } else {
        // total === 7
        if (betNumber === 7) {
          // won
          isWon = true;
          isJackpot = true;
        }
      }

      // bet amount deducted
      user.points -= betAmount;
      user.played += 1;

      if (isWon) {
        // won
        user.won += 1;

        if (isJackpot) {
          // jackpot
          user.jackpot += 1;

          // jackpot add five times of bet amount
          user.points += 5 * betAmount;
        } else {
          // won add two times of bet amount
          user.points += 2 * betAmount;
        }
      }

      await user.save();

      res.status(200).json({ error: false, dice1, dice2, isWon, isJackpot });
    } catch (error) {
      console.log({ error });
      return res
        .status(400)
        .json({ error: true, reason: "Something went wrong" });
    }
  }
);

module.exports = router;
