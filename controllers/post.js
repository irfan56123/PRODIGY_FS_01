const Post = require("../models/post");

module.exports.index = async(req,res)=>{
    const allPosts = await Post.find({});
    res.render("./post/index.ejs",{allPosts});
}

module.exports.new = (req,res)=>{
    res.render("post/new.ejs");
}

module.exports.show = async(req, res)=>{
    let {id} = req.params;
    const post = await Post.findById(id).populate("owner");

    if(!post){
           req.flash("error","Requested post does not exists! ");
           res.redirect("/post");
    }
    res.render("post/show.ejs",{post});

}
module.exports.creat = async(req,res)=>{
     let url = req.file.path;
   let filename = req.file.filename;
   console.log(url);

    const newPost= new Post(req.body);
      newPost.owner = req.user._id;
    newPost.image = {url, filename};
    
    
    await newPost.save();
        req.flash("success","New Post Created!");
    res.redirect("/post");
}

module.exports.edit = async(req, res)=>{
    let {id} = req.params;
  
    const post = await Post.findById(id)
    .populate("owner")
   if(!post){
           req.flash("error","Requested post does not exists! ");
           res.redirect("/post");
    }
    let  originalImgUrl = post.image.url;
    originalImgUrl= originalImgUrl.replace("/upload", "/upload/w_250");
    res.render("post/edit.ejs",{post,  originalImgUrl});
}

module.exports.update = async(req, res)=>{
    let {id} = req.params;
    const post = await Post.findByIdAndUpdate(id,{...req.body}).populate("owner");
      if(typeof req.file !== "undefined"){
      let url = req.file.path;
    let filename = req.file.filename;
   post.image = {url, filename};
    await post.save();
}
 req.flash("success","Post Updated!");
    res.redirect(`/post/${id}`);

}

module.exports.destroy = async(req, res)=>{
    let {id} = req.params;
   await Post.findByIdAndDelete(id);
    
 req.flash("success","Post Deleted!");

    res.redirect("/post");

}