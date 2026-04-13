const dotenv = require("dotenv");
const app = require("./app");


dotenv.config({path : "./.env"});

const port = process.env.PORT || 5000
const server = app.listen(port , ()=>{
  console.log('API is running');
})
