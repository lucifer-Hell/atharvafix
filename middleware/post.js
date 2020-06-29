const Post=require("../models/post");
const validator=require("validator");
const sanitizeHtml=require("sanitize-html");
var middlewareObj={};

middlewareObj.cleanUp=function(post){
    if(typeof(post.title)!="string"){post.title=""}
    if(typeof(post.body)!="string"){post.title=""}
    this.data={
        title:sanitizeHtml(post.title.trim(),{allowedTags:[],allowedAttributes:{}}),
        body:sanitizeHtml(post.body.trim(),{allowedTags:[],allowedAttributes:{}}),
        createdAt: new Date()
    }
}

middlewareObj.validate=function(post){
    return new Promise(async function(resolve,reject){
        if(post.title=="") {post.errormsg.push("You must provide a title")}
        if(post.body=="") {post.errormsg.push("You must provide post content")}
        resolve();
    })
}
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };

// middlewareObj.findPosts=function(value){
//     return new Promise(async function(resolve,reject){
//         const regex = new RegExp(escapeRegex(value), 'gi');
//         Post.find({title: regex},function(err,foundPosts){
//             if(err){
//                reject()   
//             }else{
//                 resolve(foundPosts)
//             }        
//         })
        
//     })
    
// }


module.exports =middlewareObj;