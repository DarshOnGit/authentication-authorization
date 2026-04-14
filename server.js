const dotenv = require("dotenv");
const app = require("./app");

const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.CONN_STR)
  .then((conn) => {
    console.log("DB connection successful");

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log("API is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
