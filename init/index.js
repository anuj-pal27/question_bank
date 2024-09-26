const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/test";
const Question = require("../model/questions");
const data = require("./data");

main()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initData = async (req, res) => {
  await Question.deleteMany();
  await Question.insertMany(data);
};

initData();
