const express = require("express");
const mongoose = require("mongoose");
let initData = require("./data.js");
const Post = require("../models/post.js");



main().then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogverse');

  
}

const initDB = async () =>{
    // await Post.deleteMany({});
    await Post.insertMany(initData.data);
    console.log("data was initialised");
};
initDB();