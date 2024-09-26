const express = require("express");
const User=require("../model/user");
const Result=require("../model/result");
const route = express.Router({mergeParams:true});
const {auth} = require("../middleware/auth");

route.get("/",auth,async (req,res)=>{
    let user= req.user.username;
    const curruser=await User.find({username:user}).populate("results");
    
    // const total_results=curruser.results;
    // console.log("your results",total_results);
    res.render("result.ejs",{results:curruser[0].results});
})

module.exports=route;