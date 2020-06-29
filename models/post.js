const mongoose=require('mongoose')

var postSchema=new mongoose.Schema({
    title: String,
    body: String,
    createdAt:{
        type: Date,
        default:Date.now
    },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    errormsg:[{
                type:String
            }]
});

module.exports = mongoose.model("Post",postSchema);; 