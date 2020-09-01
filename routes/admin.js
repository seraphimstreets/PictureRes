const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var cors = require('./cors');
const Images = require('../models/Images');
const Users = require('../models/user')
const Albums = require('../models/Albums');
const {Comments} = require('../models/Comments');
const authenticate = require("../authenticate");
const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');

const adminRouter = express.Router()
adminRouter.use(bodyParser.json())

adminRouter.route('/deleteAll')
.delete(cors.cors, (req, res, next) => {
    Images.deleteMany({})
    .then((err, imCount) => {
        Users.deleteMany({})
        .then((err, userCount) => {
            Albums.deleteMany({})
            .then((err, albumCount) => {
                Comments.deleteMany({})
                .then((err, commentCount) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({images:imCount, users:userCount, albums:albumCount, comments:commentCount})
                })
            })
        })
    })
        
    
})

module.exports = adminRouter;