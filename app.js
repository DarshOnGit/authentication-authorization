const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const authRouter = require("./routes/authRoute");

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api/auth",authRouter)

module.exports = app;