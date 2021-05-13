//Require

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

//Use

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

//Connect with Atlas

mongoose.connect("mongodb+srv://"+process.env.DBID+":"+process.env.DBPWD+"@cluster0.75ljn.mongodb.net/blogPosts?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true});

//Create schema for blog post

const postSchema = new mongoose.Schema({
    postTitle: String,
    postContent: String
});


const postModel = new mongoose.model("Post", postSchema);

//Get methods

app.get("/", function (req, res){
    postModel.find({}, function (err, data){
        if(err){
            console.log(err);
        }
        else {
            if(data){
                res.render("index", {data: data});
            }
        }
    });
});

app.get("/login", function (req, res){
    res.render("login");
});

app.get("/posts/:post", function (req, res){
    console.log(req.params)
    res.render("post");
});


//Post methods

app.post("/create", function(req, res){
    const username = req.body.ADMIN;
    const password = req.body.PASSWORD;
    if(username == process.env.ADMIN && password == process.env.PASSWORD){
        res.render("create");
    }
    else{
        res.redirect("login");
    }
});


app.post("/", function (req, res){
    const newPost = new postModel({
        postTitle: req.body.Title,
        postContent: req.body.Content
    });
    newPost.save(function (err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    });
});


const PORT = 3000 || process.env.PORT;
app.listen(PORT, function (){
    console.log("Server running on port "+PORT);
});