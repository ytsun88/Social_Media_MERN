const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").authRoute;
const postRoute = require("./routes").postRoute;
const friendRoute = require("./routes").friendRoute;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to MongoDB Atlas.");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);
app.use(
  "/api/post",
  passport.authenticate("jwt", { session: false }),
  postRoute
);
app.use(
  "/api/friend",
  passport.authenticate("jwt", { session: false }),
  friendRoute
);

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
