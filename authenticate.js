var passport =  require('passport');

var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TumblrStrategy = require('passport-tumblr').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 36000});
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
    
    User.findOne({_id:jwt_payload._id}, (err, user) => {
        
        console.log(user)
        if (err){
            return done(err)
        }
        else if (user){
          
            return done(null, user);
            
        }
        else{
            return done(null, false);
        }
    })
}))




exports.checkUser = (req,res,next) => {
    passport.authenticate('jwt', {session:false}, (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            req.user = null;
            next()
        }
    
        req.user = user;
        next()
        
    
       
    }) (req,res,next);
}

exports.verifyUser = passport.authenticate('jwt', {session:false});
exports.verifyAdmin = (req,res,next) => {
    console.log(req);
    if (req.user.admin === true){
        console.log('Admin ' + req.user.username + ' identified!')
        next()
    }else{
        err = new Error('You are not authorized to perform this operation!');
        res.statusCode = 403;
        return next(err)
    }
}

exports.facebookPassport = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['name', 'photos', 'displayName'],
    passReqToCallback: true
}, (req,accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
     
        if (err){
            return done(err, false)
        }
        if (!err && user != null){
            console.log('visiting again?')
            return done(null, user)
        }
        else{
            console.log('a new face!')
            user = new User({username: profile.displayName})
            
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            
            try{
                user.avatarPath = profile.photos[0].value;
            }catch{
                user.avatarPath = "";
            }
           
            user.save((err, user) => {
                if (err){
                    return done(err, false);
                }else{
                    console.log('HAHAH')
                    return done(null, user)
                }
            })
        }
    }) 
}));

exports.googlePassport = passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {

        console.log('HERHE')
        User.findOne({googleId: profile.id}, (err, user) => {
            console.log(profile);
            if (err){
                return done(err, false)
            }
            if (!err && user != null){
                console.log('visiting again?')
                return done(null, user)
            }
            else{
                console.log('a new face!')
                user = new User({username: profile.displayName}) 
                user.googleId = profile.id;
                user.firstname = profile._json.name.given_name;
                user.lastname = profile._json.name.family_name;
                user.avatarPath = profile._json.picture;
                user.save((err, user) => {
                    if (err){
                        return done(err, false);
                    }else{
                        return done(null, user)
                    }
                })
            }
        })
    
        
    }
  ));

exports.tumblrPassport = passport.use(new TumblrStrategy({
    consumerKey: config.tumblr.consumer_key,
    consumerSecret: config.tumblr.consumer_secret,
    callbackURL: config.tumblr.callbackURL,
    passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {
        
        
        User.findOne({tumblrId: profile.id}, (err, user) => {
            console.log(profile);
            if (err){
                return done(err, false)
            }
            if (!err && user != null){
                return done(null, user)
            }
            else{
                
                user = new User({username: profile.displayName}) 
                user.googleId = profile.id;
                user.firstname = profile._json.name.given_name;
                user.lastname = profile._json.name.family_name;
                user.avatarPath = profile._json.picture;
                user.save((err, user) => {
                    if (err){
                        return done(err, false);
                    }else{
                        return done(null, user)
                    }
                })
            }
        })
    }
));

exports.githubPassport = passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {

        console.log(profile)
        User.findOne({githubId: profile.id}, (err, user) => {
            
            if (err){
                return done(err, false)
            }
            if (!err && user != null){
                console.log('visiting again?')
                return done(null, user)
            }
            else{
                console.log('a new face!')
                user = new User({username: profile.username}) 
                user.githubId = profile.id;
                user.firstname = ""
                user.lastname = ""
                try{
                    user.avatarPath = profile.photos[0].value;
                }catch{
                    user.avatarPath = ""
                }
                
                user.save((err, user) => {
                    if (err){
                        return done(err, false);
                    }else{
                        return done(null, user)
                    }
                })
            }
        })
    }
));

exports.twitterPassport = passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {

        console.log('Profile is ' + profile)
        User.findOne({twitterId: profile.id}, (err, user) => {
            
            if (err){
                return done(err, false)
            }
            if (!err && user != null){
                console.log('visiting again?')
                return done(null, user)
            }
            else{
                console.log('a new face!')
                user = new User({username: profile.username}) 
                user.twitterId = profile.id;
                user.firstname = ""
                user.lastname = ""
                try{
                    user.avatarPath = profile.photos[0].value;
                }catch{
                    user.avatarPath = ""
                }
                
                user.save((err, user) => {
                    if (err){
                        return done(err, false);
                    }else{
                        return done(null, user)
                    }
                })
            }
        })
    }
));
