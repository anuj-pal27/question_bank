const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/test";
const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const test=require("./routes/test");
const result=require("./routes/result")
require("dotenv").config();
// const passport = require("passport");
// const localStrategy= require("passport-local");
const User = require("./model/user");
const Result = require("./model/result");
const two_mark_q = 4,
five_mark_q = 10,
seven_mark_q = 14;
let avg_Score = 0;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
main()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080, () => {
  console.log("server started");
});


// landing route
app.get("/",(req,res)=>{
  res.render("landingpage.ejs");
})
//test routes
app.use("/test",test);
app.use("/result",result);

//result routes


// signup route

app.get("/signup", (req, res) => {
  res.render("authenticate/signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    let existingUser = await User.findOne({$or: [
      { username: username },
      { email: email }
    ]});
    if (existingUser) {
      console.log("User already exists");
      return res.redirect("/signup");
    }

    //secure password

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.log("error in hashing password");
      return res.redirect("/signup");
    }
    const user = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
    console.log("user created successfully", user);
    return res.redirect("/login");
  } catch (err) {
    console.log("user cannot created", err);
  }
});

// login route

app.get("/login", (req, res) => {
  res.render("authenticate/login.ejs");
});
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  //validation on email and password

  if (!email || !password) {
    console.log("Enter email and password");
    return res.redirect("/login");
  }

  const user = await User.findOne({$or:[{email:email},{password:password}] });
  if (!user) {
    console.log("wrong password and email");
    return res.redirect("/login");
  }
  
  let payload = {
    email: user.email,
    username: user.username,
  };
  //verify password and generate a jwt token
  if (await bcrypt.compare(password, user.password)) {
    let token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "2h",
    });

    user.password = undefined;

    console.log("new user witho token", user);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 2* 60 * 60 * 1000),
      httpOnly: true,
    });
    res.redirect("/test");
  } else {
    console.log("wrong password");
    res.redirect("/login");
  }

});

