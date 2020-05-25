const express = require('express');
const bodyParser = require('body-parser');

var cors = require('./cors');
const Images = require('../models/Images');
const config = require('../config');
const Users = require('../models/user');
const mainRouter = express.Router()
mainRouter.use(bodyParser.json())
const authenticate = require('../authenticate');
mainRouter.route('/')
.get(cors.cors, (req, res, next) => {
    console.log('User is ' + req.cookies.user)
   
    if (req.cookies.user){
       
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        var m = req.cookies.token 
        var n = req.cookies.user

    
        res.render('index.ejs', {user:JSON.stringify(n),
             token:m})

    }else{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        res.render('index.ejs', {user:null, token:null})
    }
})
.post((req, res, next) => {
    console.log('Hello!');
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'application/json' );

    res.json({app:'blah'})
    })
.put()
.delete()

mainRouter.route('/login')
.get(cors.cors, (req, res, next) => {
   

    res.render('loginPage.ejs')
   
})

mainRouter.route('/signup')
.get(cors.cors, (req, res, next) => {
    console.log(req.user)
   
    if (req.user){
      
        
        res.redirect(config.baseUrl)
    }else{
        res.render('signupPage.ejs')
    }
})

mainRouter.route('/signup/success')
.get(cors.cors, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/html' );
    res.render('success.ejs')
})

mainRouter.route('/home')
.get(cors.cors,  (req, res, next) => {
    console.log(req.cookies.user)
   
    if (req.cookies.user){
       
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        
        res.render('userPage.ejs', {user:JSON.stringify(req.cookies.user), 
            token:req.cookies.token})
    }else{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        res.render('userPage.ejs', {user:null, token:null})
    }
})

mainRouter.route('/home/:ownerId')
.get(cors.cors, (req, res, next) => {
   
   
    if (req.params.ownerId){
        console.log('HEREEE')
        Users.findById(req.params.ownerId)
        .then(user => {
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'text/html' );
        
            res.render('userPage.ejs', {user:JSON.stringify(user), 
            token:req.cookies.token})
        })
       
        
    }else{
        res.redirect(config.baseUrl)
    }
   

})

mainRouter.route('/uploadImages')
.get(cors.cors, (req, res, next) => {
    console.log(req.cookies.user)
   
    if (req.cookies.user){
       
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        
        res.render('imageUploader.ejs', {user:JSON.stringify(req.cookies.user), 
            token:req.cookies.token})
    }else{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/html' );
        res.render('imageUploader.ejs', {user:null, token:null})
    }
})


module.exports = mainRouter;