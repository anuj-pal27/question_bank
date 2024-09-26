const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const Result = require("./result")
const {Schema} = mongoose;
const userSchema = new Schema({
    username:{
        type:String,required:true,trim:true
    }
    ,
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,required:true
    },
    testAttempt :{
        type:Number,
        default:0
    },
    results:[{
        type:Schema.Types.ObjectId,
        ref:"Result",
        // default:0
    }]
})


const User = mongoose.model("User",userSchema);
module.exports = User;