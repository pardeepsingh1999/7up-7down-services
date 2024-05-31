const express = require("express");
const expressjwt = require("express-jwt");

const signinRouter = require("./signin");
const signupRouter = require("./signup");
const currentUserRouter = require("./current-user");
const rollDiceRouter = require("./roll-dice");

// `/api/v1`
const router = express.Router();

const checkJwt = expressjwt({ secret: process.env.JWT_KEY }); // the JWT auth check middleware

router.use(signinRouter);
router.use(signupRouter);

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.use(currentUserRouter);
router.use(rollDiceRouter);

module.exports = router;
