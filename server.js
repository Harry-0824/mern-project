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
const path = require("path");
const port = process.env.PORT || 8080; //heroku會自動分配port

//連接mongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
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
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRoute);
//courseRoute應被jwt保護
//如果request headers內部沒有jwt,則request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//production環境
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

//React使用3000
app.listen(port, () => {
  console.log("後端伺服器已啟動於port 8080");
});
