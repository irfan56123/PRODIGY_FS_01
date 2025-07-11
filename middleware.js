const Post= require("./models/post");



module.exports.isLoggedIn = (req,res,next)=>{

     if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in");
       return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl = (req, res, next)=>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();


};


module.exports.isOwner = async (req, res, next)=>{
   let {id} = req.params;
   let post = await Post.findById(id);
    if (!post) {
        req.flash("error", "Post not found");
        return res.redirect("/post");
    }
   if(!post.owner || !req.user || !post.owner.equals(res.locals.currUser._id)){
       req.flash("error","you are not the owner of this post");
      return res.redirect(`/post/${id}`);
   }
   next();
}
