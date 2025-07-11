
 require('dotenv').config();





const express = require("express");
const multer  = require('multer')

const app = express();
let port = 3000;

const Post = require("./models/post.js")
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const { cloudinary,  storage} = require("./cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("./utills/wrapAsync.js");
const ExpressError = require("./utills/ExpressError.js");
 
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require("./models/user.js");
const {postSchema} = require("./schema.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const {saveRedirectUrl,isLoggedIn, isOwner} = require("./middleware.js")

const postRouter = require("./routes/post.js");
const userRouter = require("./routes/user.js");



const dbUrl = process.env.ATLAS_DB;
main().then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

  
}

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const store =  MongoStore.create({
    mongoUrl: dbUrl, 
    crypto: {
        secret:process.env.SECRET,
    },
     touchAfter: 24 * 3600,

});


const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(flash());
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{

     res.locals.currUser = req.user;
     res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
    next();
});


passport.use(new localStrategy(User.authenticate())); 
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const validatePost = (req, res, next)=>{
//     let {error} = postSchema.validate(req.body);
//     if (error){
//         throw new ExpressError(400, error);
//     }else {
//         next();
//     } 
   

// };

app.use("/post", postRouter);
app.use("/", userRouter);




    





// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });
// error Handling
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(status).render("error", { err });
});



app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});