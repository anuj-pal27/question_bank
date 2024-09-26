const express = require("express");

const route = express.Router({mergeParams:true});
const Question = require("../model/questions");
const { auth } = require("../middleware/auth");
const Result = require("../model/result");
const User = require("../model/user")

let rightMarks = 0,num = 0;

//home route
route.get("/", auth, (req, res) => {
  res.locals.currUser= req.user;
  res.render("home.ejs");
});



// Questions Route
route.get("/new", auth, async (req, res) => {
  let tests = await Question.find({});
  num = Number(Object.keys(req.query));
  function getRandomQuestions(data, numQuestions) {
    // Shuffle the data array
    const shuffled = data.sort(() => 0.5 - Math.random());
    // Return the first `numQuestions` items
    return shuffled.slice(0, numQuestions);
  }

  let newtests = getRandomQuestions(tests, num);
  res.render("questions_list/home.ejs", { newtests});
});

route.post("/result",auth, async (req, res) => {
  res.locals.currUser=req.user;
  let arr = [];
  arr.push(req.body);
  for (let i = 0; i < num; i++) {
    let key = Object.keys(arr[0])[i];
    let value = Object.values(arr[0])[i];
    let questions = await Question.findById(key);
    if (questions.correctAnswer === value) {
      rightMarks++;
    }
  }
  console.log(req.user);
  let test_user=req.user.username;
  const user= await User.findOne({username:test_user});
  const newResult = new Result({
    totalMarks:num,
    scoreMarks:rightMarks,
    submitAt:new Date()
  });
  newResult.save();
  user.results.push(newResult);
  user.save();
  rightMarks = 0;
  res.render("questions_list/result.ejs",{newResult});
});

module.exports = route;
