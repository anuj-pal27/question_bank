const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();

exports.auth = (req,res,next)=>{
    try{
    const token = req.cookies.token || req.body.token;
    if(!token){
        console.log("tokken missing");
        return res.redirect("/login");
    }
    try{
        jwt.verify(token,process.env.JWT_TOKEN,(err,user)=>{
            req.user= user;
        })
    }
    catch(err){
        console.log("invalid token");
    }
    next();
}
    catch(err){
        console.log(err);
    }
}
