const User=require("../models/user");
const Follow=require("../models/follow");
const Post=require("../models/post");
const mongoose=require('mongoose')
const express=require("express");
const router=express.Router();

const bcrypt=require('bcryptjs');
const middlewareUser=require('../middleware/user');
const post = require("../models/post");

router.post("/register",async (req,res)=>{
    let user= new User(req.body);

    middlewareUser.cleanUp(user);
    await middlewareUser.validate(user);
    if(user.errormsg.length>0){
        user.errormsg.forEach(function(message){
            req.flash('regErrors',message);
        })
        req.session.save(function(){
            res.redirect("/");
        })
    }    
    else{
        let salt=bcrypt.genSaltSync(10);
        user.password=bcrypt.hashSync(user.password,salt);
        User.create(user,function(err,newUser){
            if(err)
                res.json(err);
            else{
                req.session.user={username:newUser.username,id:newUser._id};
                req.session.save(function(){
                    res.redirect("/");
                })
            }
        })
    }
})

router.post("/login",(req,res)=>{
    var user=User(req.body);
    middlewareUser.cleanUp(user);
    User.findOne({username: req.body.username},(err,foundUser)=>{
        if(!foundUser || err){
            req.flash('errors',"Invalid username/password");
                req.session.save(function(){
                    res.redirect("/");
                })
        }
        else{
            if(bcrypt.compareSync(req.body.password,foundUser.password)){
                req.session.user={username:req.body.username,id:foundUser._id};
                req.session.save(function(){
                    res.redirect("/");
                })
            }
            else{
                    req.flash('errors',"Invalid username/password");
                    req.session.save(function(){
                        res.redirect("/");
                    })
            }
        }
    })
});

router.post("/logout",(req,res)=>{
    req.session.destroy(function(){
        res.redirect("/");
    });
    
});

router.get("/",async function(req,res){
    try{
        if(req.session.user){
            let userIds=await Follow.find({authorId:req.session.visitorId}).select('followedId')
            var newUserIds=userIds.map(function(following){
                return following.followedId
            })
            
            var posts=["current"]

            var respo=newUserIds.map((userId)=>{
                return User.findOne({_id:userId});
            })
            console.log("reached")
            let getVal= await Promise.all(respo)
            
             posts=[...getVal]
            console.log(posts)
            res.render('home-dashboard')
        //    response.then(()=>res.render())
        //    .catch((err)=>res.send(err))
            
        }
        else{
            res.render("homeguest",{regErrors:req.flash('regErrors')});
        }
    }
    catch{
        res.render("404")
    }
   
    
})

module.exports=router;