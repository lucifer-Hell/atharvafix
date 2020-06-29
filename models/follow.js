const mongoose=require('mongoose')

var followSchema=new mongoose.Schema({
    
    followedId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    followedUsername: String,
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    authorUsername: String,
    errormsg:[{
                type:String
            }]
});

module.exports = mongoose.model("Follow",followSchema);