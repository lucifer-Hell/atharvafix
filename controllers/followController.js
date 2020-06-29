const User=require("../models/user");
const Post=require("../models/post");
const Follow=require("../models/follow");
const express=require("express");
const router=express.Router();
const middlewareUser=require('../middleware/user');
const middlewareFollow=require('../middleware/follow');
const middlewarePost=require('../middleware/post');
const sanitizeHtml=require("sanitize-html");

router.post("/addFollow/:followUser",middlewareUser.mustBeLoggedIn,async function(req,res){
    var fuser=await User.findOne({username:req.params.followUser})
    var authuser=await User.findOne({_id:req.session.visitorId})
    if(!fuser){
        fuser=""
        fuser.username=""
    }
    var follower={
        followedId:fuser,
        followedUsername:fuser.username,
        authorId:req.session.visitorId,
        authorUsername:authuser.username,
        errormsg:[]
    }
    await middlewareFollow.validate(follower,"create");
    
    if(follower.errormsg.length>0){
        follower.errormsg.forEach(function(message){
            req.flash('errors',message);
        })
        req.session.save(function(){
            res.redirect("/");
        })
    }else{
        Follow.create(follower,function(err,createdFollow){
            if(err){
                res.json(err)
            }else{
                // console.log(createdFollow)
                req.flash('success',"Successfully Followed");
                req.session.save(function(){
                    res.redirect("/profile/"+req.params.followUser);
                })
            }
        })
    }
   
    
})

router.delete("/removeFollow/:followUser",middlewareUser.mustBeLoggedIn,async function(req,res){
    var fuser=await User.findOne({username:req.params.followUser})
    if(!fuser){
        fuser=""
    }
    var follower={
        followedId:fuser,
        authorId:req.session.visitorId,
        errormsg:[]
    }
    await middlewareFollow.validate(follower,"delete");
    
    if(follower.errormsg.length>0){
        follower.errormsg.forEach(function(message){
            req.flash('errors',message);
        })
        req.session.save(function(){
            res.redirect("/");
        })
    }else{
        Follow.findOneAndDelete(follower,function(err,createdFollow){
            if(err){
                res.json(err)
            }else{
                // console.log(createdFollow)
                req.flash('success',"Successfully Stopped Following");
                req.session.save(function(){
                    res.redirect("/profile/"+req.params.followUser);
                })
            }
        })
    }
   
    
})

module.exports=router;