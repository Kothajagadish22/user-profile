var express=require("express");
const cors = require('cors')
const helmet = require('helmet')
var cookieParser = require('cookie-parser')
var flash = require('connect-flash');
var app=express();
const session = require('express-session');
var config = require('config-lite');
var sess = require('sess')
var path = require('path');
const methodOverride = require("method-override");
app.use(express.static("public"));
var bodyParser=require("body-parser");
var nodemailer = require('nodemailer');
app.use(helmet());
app.use(cookieParser());


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(methodOverride("_method"));

// Session Setup
app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: true
}))
var sess;


app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/signup",function(req,res){
    var mongojs=require("mongojs");
    var cs="mongodb+srv://mahesh:mahesh@cluster0.qe4fh.mongodb.net/Digitalflowtask?retryWrites=true&w=majority"
    var db=mongojs(cs,["users"])

    var e = {
        Email:req.body.mail,
        Username:req.body.uname
    }
    db.users.find(e,function(err,docs){
        if(docs.length!=0){
            res.send('email and username is already registered')
        }else{
            var d={
                Username:req.body.uname,
                Name:req.body.name,
                Email:req.body.mail,
                Password:req.body.pswd,
                Address:req.body.add,
                Mobile:req.body.num,
            }
            db.users.insert(d,function(err,docs){
            if(err){
                res.send('Something went wrong')
            }else{
                res.redirect("/");
            }
            })
        }
    })
})

app.post('/login',function(req,res){
    sess = req.session;
    var mongojs=require("mongojs");
    var cs="mongodb+srv://mahesh:mahesh@cluster0.qe4fh.mongodb.net/Digitalflowtask?retryWrites=true&w=majority"
    var db=mongojs(cs,["users"])
    var d={
        Email:req.body.mail,
        Password:req.body.pswd
    }
    sess.Email = req.body.mail;
	sess.Password = req.body.pswd;
    db.users.find(d,function(err,docs){
        if(docs.length==0){
            res.send('No user found')
        }
        else{
            res.render("profile",{data:docs});
        }
    })
})

app.get("/logout",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Your node js server is running');
});