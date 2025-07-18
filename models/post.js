const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content:{
        type:String,
         required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    date: {
        type: Date,
        default: Date.now()

    },
     owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    
    
})

const Post = mongoose.model("Post",postSchema);
module.exports = Post;