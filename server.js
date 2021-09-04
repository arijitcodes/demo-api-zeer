require("dotenv").config();
const express = require("express");
const app = express();
const hemlet = require("helmet");
const morgan = require("morgan");

// Middlewares
app.use(morgan("dev"));
app.use(hemlet());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/todos", require("./routes/todos"));

// Define PORT and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Failed to start server! Error: ", error);
  } else {
    console.log("Server Started at Port: ", PORT);
  }
});
