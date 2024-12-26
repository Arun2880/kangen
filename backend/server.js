const dotenv = require("dotenv");
const app = require("./app.js");
const connectDB = require("./config/db.js");
dotenv.config({
  path: "./.env",
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
