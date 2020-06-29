const User=require("../models/user");
const Post=require("../models/post");
const Follow=require("../models/follow");
const validator=require("validator");
var middlewareObj={};

middlewareObj.cleanUp=function(user){
    if(typeof(user.username)!="string"){user.username=""}
    if(typeof(user.email)!="string"){user.email=""}
    if(typeof(user.password)!="string"){user.password=""}
    this.data={
        username:user.username.trim().toLowerCase(),
        email:user.email.trim().toLowerCase(),
        password:user.password
    }
}

middlewareObj.validate=function(user){
    return new Promise(async function(resolve,reject){
        if(user.username=="") {user.errormsg.push("You must provide a username")}
        if(user.username!="" && !validator.isAlphanumeric(user.username)) {user.errormsg.push("Username shoud contain only letters and numbers")}
        if(!validator.isEmail(user.email)) {user.errormsg.push("You must provide a valid email")}
        if(user.password=="") {user.errormsg.push("You must provide a password")}
        if(user.password.length > 0 && user.password.length < 6) {user.errormsg.push("Password must be atleast 6 characters")}
        if(user.password.length > 50) {user.errormsg.push("Password must not exceed 50 characters" )}
        if(user.username.length > 0 && user.username.length <3) {user.errormsg.push("Username must be atleast 3 characters")}
        if(user.username.length > 30) {user.errormsg.push("Username must not exceed 30 characters" )}
    
    
        if(user.username.length > 2 && user.username.length <31 &&validator.isAlphanumeric(user.username)){
            let usernameExists=await User.findOne({username:user.username});
            if(usernameExists){user.errormsg.push("Username is already taken")}
        }
        if(validator.isEmail(user.email)){
            let emailExists=await User.findOne({email:user.email});
            if(emailExists){user.errormsg.push("Email is already exits")}

        }
        resolve();
    })
}

middlewareObj.mustBeLoggedIn=function(req,res,next){
    if(req.session.user){
        next()
    }else{
        req.flash('errors',"You must be Logged In");
        req.session.save(function(){
            res.redirect("/");
        })
    }
}

middlewareObj.sharedData=async function(profileId,visitorId){
    let postCountP= await User.findOne({_id:profileId}) 
    let followerCountP= await Follow.find({followedId:profileId})
    let followingCountP= await Follow.find({authorId:profileId})
    let postCount= postCountP.posts.length
    let followerCount=followerCountP.length
    let followingCount=followingCountP.length


    var followed= await Follow.findOne({followedId:profileId,authorId:visitorId})
    let isFollowing=false;
    if(followed){
        isFollowing =true
    }
    // req.postCount=postCount
    // req.followerCount=followerCount
    // req.followingCount=followingCount
    return [isFollowing,postCount,followerCount,followingCount];
}

module.exports =middlewareObj;