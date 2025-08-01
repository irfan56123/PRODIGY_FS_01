const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");



//signup

router.get("/signup",userController.signupgetRoute);

router.post("/signup", wrapAsync(userController.signupPostRoute));
    


// login

router.get("/login",userController.logingetRoute);
router.post("/login", saveRedirectUrl,
    passport
    .authenticate("local",{failureRedirect:'/login', failureFlash:true}),
    wrapAsync(userController.loginpostRoute));

//logout

router.get("/logout",userController.logoutRoute);

//privacy
router.get("/privacy",userController.privacyRoute);


module.exports = router;