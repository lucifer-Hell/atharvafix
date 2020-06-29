const User=require("../models/user");
const Post=require("../models/post");
const express=require("express");
const router=express.Router();
const middlewareUser=require('../middleware/user');
const middlewarePost=require('../middleware/post');
const sanitizeHtml=require("sanitize-html");


router.get("/create-post",middlewareUser.mustBeLoggedIn,function(req,res){
    res.render("create-post");
})

router.post("/create-post",middlewareUser.mustBeLoggedIn,async function(req,res){
    var post={  title:req.body.title,
                body:req.body.body,
                author:{
                    id:req.session.user.id,
                    username:req.session.user.username
                },
                errormsg:[]
            }
    console.log(post);
    middlewarePost.cleanUp(post);
    await middlewarePost.validate(post);
    if(post.errormsg.length>0){
        post.errormsg.forEach(function(message){
            req.flash('errors',message);
        })
        req.session.save(function(){
            res.redirect("/");
        })
    }
    else{
        Post.create(post,function(err,newPost){
            if(err){
                res.send("Try again later");
            }
            else{
                User.findOne({username:newPost.author.username},function(err,newUser){
                    if(err || !newUser){
                        res.render("404");
                    }else{
                        // console.log(foundCampground);
                        // res.render("campgrounds/show",{campground:foundCampground,currentUser:req.user});
                        newUser.posts.push(newPost)
                        // newUser.posts.push(newPost);
                        newUser.save();
                        req.flash('success',"New Post created !!!");
                        req.session.save(function(){
                            res.render("single-post-screen",{post:newPost,id:req.session.visitorId});
                        })
                        // res.send(newUser);
                    }
                })
                // res.send("New post created");
            }
        })
    }


})

router.get("/post/:id",middlewareUser.mustBeLoggedIn,function(req,res){
    var id=req.params.id;
    if(typeof(id)!="string"){
        res.render("404");
    }
    Post.findById(id,function(err,foundPost){
        if(err){
            res.render("404");
        }
        else{
            // console.log(req.session.user)
            
            res.render("single-post-screen",{post:foundPost,id:req.session.visitorId});
        }
    })
   
})

router.get("/post/:id/edit",middlewareUser.mustBeLoggedIn,async function(req,res){
    try{ 
        var id=req.params.id;
        
        Post.findById(id,function(err,foundPost){
            if(err){
                res.render("404");
            }
            else{
                console.log(foundPost)
                if(req.session.user.id==foundPost.author.id){
                    res.render("edit-post",{post:foundPost});
                }else{
                    req.flash('errors',"You dont have permission to do that");
                    req.session.save(function(){
                        res.redirect("/");
                    })
                    // res.render("/");
                }
                
            }
        })
    }
    catch{
        res.render("404");
    }
    
})

router.put("/post/:id",middlewareUser.mustBeLoggedIn,async function(req,res){
    try{
        // res.send("Put route")
        var id=req.params.id;
        var data1=req.body;
        var data={
            title:sanitizeHtml(data1.title.trim(),{allowedTags:[],allowedAttributes:{}}),
            body:sanitizeHtml(data1.body.trim(),{allowedTags:[],allowedAttributes:{}}),
        }
        Post.findByIdAndUpdate(id,data,function(err,updatedPost){
            if(err){
                res.render("404");
            }
            else{
                // console.log(updatedPost)
                User.findOne({username:updatedPost.author.username},function(err,foundUser){
                    if(err){
                        res.redirect("/post/"+id)
                    }else{
                        foundUser.posts.forEach(function(post,i){
                            if(post._id==id){
                                // console.log(post);
                                var newPost =post;
                                foundUser.posts.splice(i,1);
                                newPost.title=req.body.title;
                                newPost.body=req.body.body;
                                foundUser.posts.push(newPost);
                                // console.log(foundUser.posts);
                                // foundUser.save();
                            }

                        })
                        
                        foundUser.save();
                        res.redirect("/post/"+id);
                    }
                })
                
            }
        })
    }
    catch{
        res.render("404");
    }
    
})

router.delete("/post/:id",middlewareUser.mustBeLoggedIn,async function(req,res){
    try{
        // res.send("Put route")
        var id=req.params.id;
        var post1=await Post.findById(id); 
        if (req.session.user && post1 && post1.author.id.equals(req.session.user.id)){
            Post.findByIdAndDelete(id,function(err,deletedPost){
                if(err){
                    res.render("404");
                }
                else{
                    // console.log(updatedPost)
                    User.findOne({username:deletedPost.author.username},function(err,foundUser){
                        if(err){
                            res.redirect("/post/"+id)
                        }else{
                            // req.flash('success',"Post Updated!!!");
                            // req.session.save(function(){
                            //     res.redirect("/");
                            // })
                            foundUser.posts.forEach(function(post,i){
                                if(post._id==id){
                                    // console.log(post);
                                    var newPost =post;
                                    foundUser.posts.splice(i,1);
                                    // console.log(foundUser.posts);
                                    // foundUser.save();
                                }
    
                            })
                            
                            foundUser.save();
                            res.redirect("/profile/"+foundUser.username);
                        }
                    })
                    
                }
            })
        }
        else{
            req.flash('errors',"You dont have permission to do that");
            req.session.save(function(){
                res.redirect("/");
            })
            res.redirect("/");
        }
        
    }
    catch{
        res.render("404");
    }
    
})

router.post("/search", function(req,res){
    
    
    return new Promise(function(resolve,reject){
        try{
            const regex = new RegExp(escapeRegex(req.body.searchTerm), 'gi');
            Post.find({title: regex},function(err,foundPosts){
                if(err){
                    // res.json({message:"No post found"})  
                    reject()
                }else{
                    // console.log(foundPosts)

                    res.json(foundPosts)
                    // resolve()
                    resolve ()
        
                }        
            })
        }
        catch{
            reject();
        }    
    })
            
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;