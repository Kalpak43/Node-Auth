const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { connect } = require("./db/db");
const userController = require("./controllers/user.controller");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

let dbConnected = false;
connect()
  .then(() => {
    dbConnected = true;
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

function checkDbConnection(req, res, next) {
  if (!dbConnected) {
    return res.status(503).json({
      message: "Service Unavailable - Database connection not established",
    });
  }
  next();
}

app.use(checkDbConnection);
app.use((req, res, next) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const time = date.toLocaleTimeString();

  console.log(
    `${req.originalUrl} \t ${day}/${month}/${year}T${time} \t ${req.method} \t ${req.ip}`
  );

  next();
});

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Hello World!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use(express.json());
app.use(cookieParser());

app.post("/login", userController.login);
app.post("/signup", userController.signup);
app.get("/logout", userController.logout);
app.get("/profile", userController.profile);
app.get("/verify-email", userController.verifyEmail);
app.post("/forgot-password", userController.forgotPassword);
app.post("/reset-password", userController.resetPassword);

app.listen(port, () => {
  console.log(`Listening on Port: ${port}...`);
});
