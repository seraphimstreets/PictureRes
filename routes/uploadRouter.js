const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer'); //used for handling multi-part form data
const cors = require('./cors');
const Images = require('../models/Images');
const Albums = require('../models/Albums');
const Users = require('../models/user');
const passport = require('passport');
const sizeOf = require('image-size');
const mongoose = require('mongoose')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, 'assets/images');

    },

})

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can only upload image files!'), false)
    }else{
        cb(null, true)
    }
}

const upload = multer({storage:storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json())




uploadRouter.route('/single')
.options(cors.corsWithOptions, (req, res, next) => { res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,(req,  res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,  res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, (req,  res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser,
    upload.single('file'), (req,  res, next) => {

        Images.create({filename:req.file.filename})
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, err => next(err))
        .catch(err => next(err))
        
    })

uploadRouter.route('/array')
.post(cors.corsWithOptions, authenticate.verifyUser,
    upload.array('file', 9), (req,  res, next) => {
        var dimensions;
        req.files.forEach(file => {
            Images.create({filename:file.filename, author:req.user._id})
            .then((resp) => {
                console.log(resp)
                              
            }, err => next(err))
            .catch(err => next(err))
                
        })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true});
    }
);

uploadRouter.route('/uploadAlbum')
.post(cors.corsWithOptions, authenticate.verifyUser,
    upload.array('file', 64), (req,  res, next) => {
        Users.findById(req.user._id)
        .then(poster => {
            Albums.create({title:req.body.albumTitle, description:req.body.albumDescription, author:req.user._id})
            .then(album => {
                console.log(req.files)
                var all_imgs = []
                var all_img_ids = []
                var files_length = req.files.length
                var counter = 0;
                req.files.forEach(file => {
                    all_imgs.push({"filename":file.filename, "author":req.user._id, "description": req.body.description[counter]})
                    counter += 1
                })
                console.log(all_imgs)
                    
                Images.create(all_imgs)
                .then((imgs) => {
                    console.log(imgs)
                    
                    for(var i=0;i<imgs.length;i++){
                        all_img_ids.push(imgs[i]._id)
                    }
                    console.log(all_img_ids)
                
                
                    if (counter >= files_length){
                        console.log('MMM')
                        album.images = all_img_ids
                        if(req.body.uploadTags){
                            album.tags = req.body.uploadTags
                        }
                        console.log(album)
                        album.save()
                        .then((album) =>  {
                            poster.albums.push(album._id)
                            poster.save()
                            .then( poster =>{

                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success:true, album:album, poster:poster});
                            
                                }
                                
                            )
                           
                        })
                        .catch(err => next(err))
                        
                    }
                    
                
                }, err => next(err))
                .catch(err => next(err))
        
                
            })
            .catch(err => next(err))

        })

        
        
        
    }
);
        

module.exports = uploadRouter