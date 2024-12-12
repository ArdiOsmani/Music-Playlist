const express = require("express");
const cors = require("cors");
const userController = require("./controllers/UserController");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    preflightContinue: true,
  })
);
app.use(express.json());

app.use("/users", userController);

app.listen(8585);