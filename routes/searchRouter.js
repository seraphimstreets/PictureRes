const express = require('express');
const bodyParser = require('body-parser');

var cors = require('./cors');
const Images = require('../models/Images');
const config = require('../config');
const Users = require('../models/user');
const Albums = require('../models/Albums');
const searchRouter = express.Router()
searchRouter.use(bodyParser.json())
const authenticate = require('../authenticate');

searchRouter.route('/')
.get(cors.cors, (req, res, next) => {
    
    if(req.query.term){

        Albums.find({"title":{"$regex":req.query.term}})
        
        .sort({likes:'ascending'})
        .limit(req.query.count * 5)
        .populate('images')
        .populate('author')
        .then(albums => {
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'text/html' );
            
            user = req.cookies.user
            token = req.cookies.token 
            aList = albums.slice(req.query.count*5, req.query.count*5+5)
            console.log('HAHA')
            console.log(aList)
            res.render('searchResults.ejs', {albumList:JSON.stringify(aList), user:JSON.stringify(user), token:JSON.stringify(token)})
        })
    }
})

module.exports = searchRouter;