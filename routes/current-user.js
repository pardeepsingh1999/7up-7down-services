const { User } = require("../models/user");

const express = require("express");

// `/api/v1`
const router = express.Router();

router.get("/currentuser", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ error: true, reason: "Not authorized" });
    }

    res.status(200).json({ error: false, user });
  } catch (error) {
    return res
      .status(400)
      .json({ error: true, reason: "Something went wrong" });
  }
});

module.exports = router;
