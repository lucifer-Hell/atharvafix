const User=require("../models/user");
const Follow=require("../models/follow");
const validator=require("validator");
var middlewareObj={};

// middlewareObj.cleanUp=function(user){
//     if(typeof(user.username)!="string"){user.username=""}
//     if(typeof(user.email)!="string"){user.email=""}
//     if(typeof(user.password)!="string"){user.password=""}
//     this.data={
//         username:user.username.trim().toLowerCase(),
//         email:user.email.trim().toLowerCase(),
//         password:user.password
//     }
// }

middlewareObj.validate=function(follower,action){
    return new Promise(async function(resolve,reject){
        if(follower.followedId=="") {follower.errormsg.push("The user to be followed must exist first")}
        if(follower.followedId.equals(follower.authorId)) {follower.errormsg.push("You cannot follow  yourself")}
        let followerExists= await Follow.findOne({followedId:follower.followedId,authorId:follower.authorId})
        if(action=="create"){
            if(followerExists){
                follower.errormsg.push("You cannot follow a user you have already followed")
            }    
        }
        if(action=="delete"){
            if(!followerExists){
                follower.errormsg.push("You cannot unfollow a user you already dont follow")
            }  
        }
        resolve();
    })
}


module.exports =middlewareObj;