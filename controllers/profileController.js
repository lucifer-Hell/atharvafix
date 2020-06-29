const User=require("../models/user");
const Follow=require("../models/follow");
const Post=require("../models/post");
const express=require("express");
const router=express.Router();
const middlewareUser=require('../middleware/user');
const middlewarePost=require('../middleware/post');

router.get("/:username",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            console.log(isFollowing)
            if(!foundUser){
                return res.render("404");
            }
            else{
                res.render("profile",{
                    currentPage:"posts",
                    posts:foundUser.posts,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

router.get("/:username/followers",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            let followers= await Follow.find({followedId:foundUser._id}).select('authorId authorUsername')
            // console.log(followerIdList)
            // console.log(follower)
            if(!foundUser){
                return res.render("404");
            }
            else{
                // res.json(followers)
                res.render("profile-followers",{
                    currentPage:"followers",
                    followers:followers,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

router.get("/:username/following",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            let following= await Follow.find({authorId:foundUser._id}).select('followedId followedUsername')
            // console.log(followerIdList)
            // console.log(follower)
            if(!foundUser){
                return res.render("404");
            }
            else{
                // res.json(followers)
                res.render("profile-following",{
                    currentPage:"following",
                    following:following,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

module.exports=router;