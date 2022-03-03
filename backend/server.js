const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fetch = require("node-fetch");

const PORT = process.env.PORT || 4000;
const API_SERVICE_URL = "https://www.metaweather.com/api";

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
  })
);

// Logging
app.use(morgan("dev"));

// Authorization
// app.use('', (req, res, next) => {
//   if (req.headers.authorization === 'fast-nguyen') {
//     next();
//   } else {
//     res.status(403);
//     res.json({
//       message: 'Authorization is required.',
//     });
//   }
// });

app.get("/meta-weather/*", async (req, res, next) => {
  try {
    const query = new URLSearchParams(req.query);
    const url = `${API_SERVICE_URL}${req.path.replace(
      "/meta-weather",
      ""
    )}?${query}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.log("error", err);
  return res.status(500).json({
    message: err.message || "Oops! Unknown error",
  });
});

app.listen(PORT, () => {
  console.log(`Starting proxy at ${PORT}`);
});
