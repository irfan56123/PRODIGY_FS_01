const User = require("../models/user");

module.exports.signupgetRoute =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupPostRoute = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
   const newUser = new User({email, username});
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser);
   req.login(registeredUser, (err)=>{
    if(err){
        return next(err);
    }
    
   req.flash("success", "Welcome to Blogverse");
   res.redirect("/post"); 
   })
    }
     catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.logingetRoute = (req, res)=>{
    res.render("users/login.ejs")
}

module.exports.loginpostRoute = async (req,res)=>{
        req.flash("success","Welcome back to Blogverse! You are logged in!");
      let redirectUrl = res.locals.redirectUrl || "/post";
    res.redirect(redirectUrl);

}

module.exports.logoutRoute = (req,res)=>{
   req.logOut((err)=>{
    if(err){
       return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/post");
 })
}

module.exports.privacyRoute = (req,res)=>{
    res.render("privacyPolicy/privacy.ejs");
}