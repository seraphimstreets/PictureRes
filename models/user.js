var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },

    admin:{
        type:Boolean,
        default:false
    },
    facebookId:String,
    googleId:String,
    tumblrId:String,
    githubId:String,
    twitterId:String,
    avatarPath:{
        type:String,
        default:''
    },
    followers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    liked:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    bookmarks:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    albums:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }]

})

User.plugin(passportLocalMongoose, {usernameUnique: false});

module.exports = mongoose.model('User', User);