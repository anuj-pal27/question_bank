const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    totalMarks:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    scoreMarks:{
        type:Number,
        required:true,
        default:0,
    },
    submitAt:{
        type:Date,
        default:new Date,
    }
})
const Result = mongoose.model("Result",resultSchema);
module.exports = Result;
