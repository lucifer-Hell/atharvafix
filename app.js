const express=require('express')
const app=express()
const mongoose=require('mongoose')
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const profileController = require("./controllers/profileController")
const followController = require("./controllers/followController")
const session=require('express-session');
const methodOverride=require('method-override');
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const markdown=require('marked');
const bodyParser=require("body-parser")
const sanitizeHtml=require("sanitize-html");

const dotenv=require('dotenv');
const { urlencoded } = require('body-parser')
dotenv.config();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

let sessionOptions=session({
    secret:"I am so coool",
    store:new MongoStore({
        url: 'mongodb://localhost/complexApp',
        touchAfter: 24 * 3600 // time period in seconds
    }),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24, httpOnly:true}
})
app.use(sessionOptions);
app.use(flash());
app.use(methodOverride("_method"));
mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://localhost/complexApp", {useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false}).then(() => console.log('DB Connected!')).catch(err => {
console.log("DB Connection Error: ");
});

app.use(function(req,res,next){
    res.locals.filterUserHTML=function(content){
        return markdown(content);
    }

    if(req.session.user){
        req.session.visitorId=req.session.user.id;
    }
    else{
        req.session.visitorId=0;
    }
    res.locals.errors=req.flash("errors");
    res.locals.success=req.flash("success");
    res.locals.user=req.session.user;
    next();
})

app.use("/",userController);
app.use("/",postController);
app.use("/profile",profileController);
app.use("/",followController);

app.listen(3000,function(){
    console.log("App started at " );
    console.log(process.env.PORT);
})
