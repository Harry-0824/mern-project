const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const { route } = require("./routes/auth");
require("./config/passport")(passport);
const cors = require("cors");

//連接mongoDB
mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("連接到mongoDB..");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
//courseRoute應被jwt保護
//如果request headers內部沒有jwt,則request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//只有登入系統的人才能去新增課程或註冊課程

//React使用3000
app.listen(8080, () => {
  console.log("後端伺服器已啟動於port 8080");
});
