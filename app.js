const express = require("express");
const { json } = require("body-parser");
const cors = require("cors");

const authRouter = require("./routes");

const app = express();

app.use(cors());

app.use(json());

app.use(`/api/v1`, authRouter);

/**
 * Event listener for HTTP server "error" event.
 */

app.all("*", async (req, res) => {
  return res.status(404).json({ error: true, reason: "Not Found" });
});

//passing the Error caught by asyncErrorHandle to Error middleware
app.use(ErrorHandlingMiddleware);

function ErrorHandlingMiddleware(err, req, res, next) {
  console.log({ err });
  return res
    .status(err.status)
    .json({ error: true, reason: err.inner.message });
}

module.exports = { app };
