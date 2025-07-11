const express = require("express");
const router = express.Router();
const Post = require("../models/post.js");
const {postSchema} = require("../schema.js");
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const postController = require("../controllers/post.js");


const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer( { storage });

const validatePost = (req, res, next)=>{
    let {error} = postSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, error);
    }else {
        next();
    } 
   

};

//index

router.get("/",wrapAsync(postController.index));

//new
router.get("/new",isLoggedIn,postController.new);

//show
router.get("/:id",wrapAsync(postController.show));

//creat
router.post("/",isLoggedIn,upload.single('image'),validatePost,wrapAsync(postController.creat));

//edit

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(postController.edit));

// update
router.put("/:id",isLoggedIn,isOwner,upload.single('image'),validatePost,wrapAsync(postController.update));
// delete
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(postController.destroy));

module.exports = router;