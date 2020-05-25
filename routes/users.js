const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
var cors = require('./cors');
const passport = require('passport');
const userRouter = express.Router()
userRouter.use(bodyParser.json())
var authenticate = require('../authenticate')

const config = require('../config')


userRouter.post('/signup',  (req, res, next) => {
    
    User.register(new User({username: req.body.username}), 
      req.body.password,  (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.avatarPath) user.avatarPath = req.body.avatarPath
        user.save((err, user) => {
          if (err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
       
      }
    });
  });

userRouter.post('/login',  (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
  
      if (!user) {
      
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: info});
      }
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
        }
  
        var token = authenticate.getToken({_id: req.user._id});
        User.findOne({username:req.body.username})
        .then(user => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login Successful!', token: token, avatarPath: user.avatarPath});
        })
       
      }); 
    }) (req, res, next);
  });

userRouter.get('/checkJWTToken',  (req, res) => {
    passport.authenticate('jwt', {session:false}, (err, user, info) => {
   
      if (err) return next(err);
      if (!user){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status:'JWT invalid!', success:false, err:info})
      }else{
      
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var token = authenticate.getToken({_id:user._id});
        return res.json({status:'JWT valid!', success:true, user:user, refresh_token:token})
      }
    })(req,res)
  })


userRouter.get('/logout', authenticate.verifyUser, (req, res, next) => {
    if (req.user){
      res.statusCode = 200;
      res.clearCookie('user');
      res.clearCookie('token');
      res.setHeader('Content-Type', 'application/json');
      res.json({loggedout: true, status: 'Logout Successful!'});
    }else{
      var err = new Error('You are not logged in')
      err.status = 403;
      next(err);
    }
  })

  userRouter.get('/userInfo/:userId', (req,res,next) => {
    User.findById(req.params.userId)
    .then(user => {
      res.statusCode = 200
      res.setHeader('Content-Type', "application/json");
      res.json({user:user});
    })
  })

userRouter.get('/auth/google', passport.authenticate('google', 
{ scope: ['openid profile email'] }), 
(req,res,next) => {
if (req.user){
    
    var token = authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, user:req.user});
    
}
})

userRouter.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: 'https://localhost:3443' }),
(req, res, next) => {
    
    var token = authenticate.getToken({_id:req.user._id});
   
   
    
    res.cookie('token', token);
    res.cookie('user', req.user)
    
    res.redirect(config.baseUrl);
 
    
    
})

userRouter.get('/auth/facebook', cors.corsWithOptions,  passport.authenticate('facebook'), (req,res,next) => {
    if (req.user){
      var token = authenticate.getToken({_id:req.user._id});

      console.log('VERIFIED')
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, user:req.user});
    }
  })

userRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: config.baseUrl }),
  (req, res, next) => {
      
      var token = authenticate.getToken({_id:req.user._id});
     
     
      res.cookie('token', token);
      res.cookie('user', req.user)
      res.redirect(config.baseUrl);
})

userRouter.get('/auth/tumblr', cors.corsWithOptions,  passport.authenticate('tumblr'), (req,res,next) => {
    if (req.user){
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, user:req.user});
    }
  })

userRouter.get('/auth/tumblr/callback',
  passport.authenticate('tumblr', {failureRedirect: config.baseUrl}),
  (req, res, next) => {
      
      var token = authenticate.getToken({_id:req.user._id});
     
     
   
      
      res.cookie('token', token);
      res.cookie('user', req.user)
      res.redirect(config.baseUrl);
})

userRouter.get('/auth/github', cors.corsWithOptions,  passport.authenticate('github'), (req,res,next) => {
    if (req.user){
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, user:req.user});
    }
  })

userRouter.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: config.baseUrl }),
  (req, res, next) => {
      
      var token = authenticate.getToken({_id:req.user._id});
     
     
     
      
      res.cookie('token', token);
      res.cookie('user', req.user)

   
      
      res.redirect(config.baseUrl);
})

userRouter.get('/auth/tumblr/callback',
  passport.authenticate('tumblr', {failureRedirect: config.baseUrl}),
  (req, res, next) => {
      
      var token = authenticate.getToken({_id:req.user._id});
     
     
   
      
      res.cookie('token', token);
      res.cookie('user', req.user)
      res.redirect(config.baseUrl);
})

userRouter.get('/auth/twitter',   passport.authenticate('twitter'), (req,res,next) => {
    if (req.user){
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, user:req.user});
    }
  })

userRouter.get('/auth/twitter/callback',
  passport.authenticate('twitter', {failureRedirect: config.baseUrl }),
  (req, res, next) => {
      
      var token = authenticate.getToken({_id:req.user._id});
     
     
     
      
      res.cookie('token', token);
      res.cookie('user', req.user)

   
      
      res.redirect(config.baseUrl);
})




module.exports = userRouter;
  