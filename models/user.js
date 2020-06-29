const mongoose=require('mongoose')
const Post=require("./post");

var userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String ,
        reuired:true,
        unique:true
    },
    postIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"

    }],
    posts: [{
        type:mongoose.Schema.Types.Mixed,
        ref:"Post"

    }],
    errormsg:[{
                type:String
            }]
});

module.exports = mongoose.model("User",userSchema);; 