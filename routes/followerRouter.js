const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const authenticate = require('../authenticate');
var cors = require('./cors');

const followerRouter = express.Router()
followerRouter.use(bodyParser.json())

followerRouter.route('/:userId')
.get(cors.cors, (req, res, next) => {
    Users.findById(req.params.userId)
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', "application/json");
        res.json({followers:user.folowers});
    })
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Users.findById(req.params.userId)
    .then(user => {
        Users.findById(req.user._id)
        .then(performer => {
            user.followers.push(performer._id)
            user.save()
            .then(user => {
                performer.following.push(user._id)
                performer.save()
                .then(performer => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true, following:true});

                })
                .catch(err => next(err))
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Users.findById(req.params.userId)
    .then(user => {
        Users.findById(req.user._id)
        .then(performer => {
            user.followers.pull(performer._id)
            user.save()
            .then(user => {
                performer.following.pull(user._id)
                performer.save()
                .then(performer => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true, following:false});

                })
                .catch(err => next(err))
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

module.exports = followerRouter;