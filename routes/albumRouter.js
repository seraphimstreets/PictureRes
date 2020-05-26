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

const deleteFile = (file) => {
       fs.unlink(file, (err) => {
           if (err) throw err;
       })
}


ObjectId = require('mongodb').ObjectID;
const albumRouter = express.Router()
albumRouter.use(bodyParser.json())

function checkId(list, id){
    for(var i=0;i<list.length;i++){
        if (list[i].equals(id)) return false
    }
    
    return true
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

albumRouter.route('/')
.get(cors.cors, (req,res,next)=>{
  
 
    if (req.query.latest){
        Albums.countDocuments({}, (err, count) => {
            console.log(count)
            Albums.find({}).sort({'createdAt':-1}).limit(12)
            .populate('images')
            .populate('author')
            .then((albums) => {
            
                if(albums!= null){
                    
                        
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json' );

                    res.json({'albumList':albums, 'count':count});
                }else{
                    err = new Error('Images not found!')
                    err.status = 404;
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
            
        })
        .catch(err => next(err))
    }
    else if (req.query.page){
        Albums.countDocuments({}, (err, count) => {
           
            Albums.find({}).sort({'createdAt':-1}).limit((req.query.page+1)*12)
            .populate('images')
            .populate('author')
            .then((albums) => {
               
                if(albums != null){
                    
                        
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json' );

                    res.json({'albumList':albums.slice(req.query.page*12, (req.query.page+1)*12), 'count':count});
                }else{
                    err = new Error('Images not found!')
                    err.status = 404;
                    return next(err)
                }
            }, err => next(err))
            .catch(err => next(err))
            
        })
        .catch(err => next(err))
    }
        
        
    
})
.delete(cors.cors, authenticate.verifyUser,(req,res,next)=>{
    console.log(__dirname)
    albumIds = req.body.ids;
    
    req.body.ids.forEach(id => {
        Albums.findById(id)
        .then(album => {
           
            album.images.forEach(imageId => {
                console.log(imageId)
                Images.findByIdAndDelete(imageId)
                .then(resp => deleteFile(__dirname + '/../assets/images/' + resp.filename))

            })
            console.log('HERE')

            Users.findById(req.user._id)
            .then(user => {
                user.albums.pull(id)
                user.save()
              
               
               
            })

            Albums.findByIdAndDelete(id)
            .then(resp => console.log(resp))
            
            
            
        })

    })
 
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'application/json' );

    res.json({'success':true});
    
})

albumRouter.route('/useralbum/:userId')
.get(cors.cors,  (req,res,next)=>{
   
    Albums.find({author:req.params.userId}).sort({'createdAt':-1}).limit(18)
    .populate('images')
    .populate('author')
    .then((albums) => {
        if(albums != null){
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json' );

            res.json({'albumList':albums});
        }else{
            err = new Error('Albums not found!')
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err))
})

albumRouter.route('/:albumId/')
.get(cors.cors, (req,res,next)=>{
    Albums
    
    .findById(req.params.albumId)
    .populate('images')
    .then((album) => {
        
            album_length = album.images.length
            if(req.query.page){
                var current = parseInt(req.query.page)
            }else{
                var current = 0
            }
            console.log(album_length)
            console.log(current)

            var img = album.images[current]
        
            if(current - 1 >= 0){
                var prev_id = current - 1
            }else{
                var prev_id = -1;
            }

            if(current + 1 < album_length){
                var next_id = current + 1
            }else{
                var next_id = -1;
            }

            if(req.query.origPage){
                var origPage = req.query.origPage 
            }

            console.log(next_id)
       
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'text/html' );
            res.render('imgDisplay.ejs', {img:JSON.stringify(img), prev_id:prev_id, next_id:next_id, origPage: JSON.stringify(origPage), albumId:JSON.stringify(req.params.albumId)})
    })
})

albumRouter.route('/:albumId/:imageId')
.get(cors.cors, (req,res,next)=>{
    
    Albums
  
    .findOne({'_id':req.params.albumId})
    
    .then((album) => {
        console.log(album)
        if(album != null){
                    
            Comments.find({baseImage:req.params.imageId})
            .then((coms) => {
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json' );

                res.json({'album':album, 'numcomments':coms.length});
            })
            
        }else{
            err = new Error('Images not found!')
            err.status = 404;
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
                  
    
})
    
    
.post(cors.cors, (req,res,next)=>{
   
})
.put()
.delete();

albumRouter.route('/imFind/')
.get(cors.cors, (req,res,next)=>{
    Images
    .find({filename:req.query.imageId})
    .populate('author')
    .populate('comments')

    .then((img) => {
            console.log(img)
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'text/html' );
            res.render('imgDisplay.ejs', {img:JSON.stringify(img)})
    })
})

albumRouter.route('/:imageId/like')
.put(cors.cors, authenticate.verifyUser, (req,res,next)=>{
      Images.findById(req.params.imageId, (err, img) => {
        if (err){
            console.log('AAAA')
            return next(err)
        }else{
            var likedUsers = img.toObject().liked
            if (checkId(likedUsers, req.user._id)){
                Users.findById(req.user._id)
                .then(user => {
                    if (!user){
                        console.log('BBBB')
                        return next(err)

                    }else{
                        var likedImages = user.toObject().liked
                        if (checkId(likedImages, req.params.imageId)){
                            
                            img.liked.push(mongoose.Types.ObjectId(req.user._id))
                            user.liked.push(mongoose.Types.ObjectId(req.params.imageId))
                            img.save()
                            user.save()
                            res.statusCode = 200;
                            res.setHeader('Content-Type' , 'application/json' );
                            res.json({success:true, statusMessage:'Successfully liked!', liked:true})
                        }else{
                            console.log('NNNN')
                            res.statusCode = 200;
                            res.setHeader('Content-Type' , 'application/json' );
                            res.json({success:false , statusMessage:'Already liked!' })
                        }
                    }
                })
                
            }else{
                console.log('MMMM')
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json' );
                res.json({success:false , statusMessage:'Already liked!' })
            }
            
        }
    })
    
})



albumRouter.route('/:imageId/unlike')
.put(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Images.findById(req.params.imageId, (err, img) => {
      if (err){
          return next(err)
      }else{
          var likedUsers = img.toObject().liked
          if (!checkId(likedUsers, req.user._id)){
              Users.findById(req.user._id)
              .then(user => {
                  if (!user){
                      return next(err)
                  }else{
                      var likedImages = user.toObject().liked
                      if (!checkId(likedImages, req.params.imageId)){
                          
                          img.liked.pull(mongoose.Types.ObjectId(req.user._id))
                          user.liked.pull(mongoose.Types.ObjectId(req.params.imageId))
                          img.save()
                            user.save()
                          res.statusCode = 200;
                          res.setHeader('Content-Type' , 'application/json' );
                          res.json({success:true, statusMessage:'Successfully unliked!', liked:false})
                      }else{
                          res.statusCode = 200;
                          res.setHeader('Content-Type' , 'application/json' );
                          res.json({success:false , statusMessage:'User has not even liked the image!' })
                      }
                  }
              })
              
          }else{
              res.statusCode = 200;
              res.setHeader('Content-Type' , 'application/json' );
              res.json({success:false , statusMessage:'User has not even liked the image!' })
          }
          
      }
  })
  
})


albumRouter.route('/:imageId/comments')
.get(cors.cors, (req,res,next)=>{
    Images.findById(req.params.imageId)
    .populate('comments')
    .populate({path:'comments',
        populate:{
            path:'author',
            model:'User'
        }
    })
    .then(img => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json' );
        res.json({comments:img.comments});
    })
    .catch(err => next(err))
})
.post(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Comments.create({author:req.user._id, content:req.body.commentBody, baseImage:req.params.imageId})
    .then(comment => {
        console.log(comment)

        Images.findById(req.params.imageId, (err, img) => {
            if (err){
              
                return next(err)
            }else{
                img.comments.push(mongoose.Types.ObjectId(comment._id))
                img.save()
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json' );
                res.json({success:true, comment:comment});
            }
        })


    })
    .catch(err => next(err))
    
})

albumRouter.route('/:imageId/:commentId/subcomment')
.get(cors.cors,(req, res, next) => {
    Comments.findById(req.params.commentId)
    .populate('subcomments')
    .populate({path:'subcomments',
        populate:{
            path:'author',
            model:'User'
        }
    })
    .then((com) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json' );
        res.json({subcomments: com.subcomments});
    })
    .catch(err => next(err))
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Comments.create({author:req.user._id, content:req.body.commentBody, baseImage:req.params.imageId})
    .then(subcomment => {
        console.log(subcomment)

        Comments.findById(req.params.commentId, (err, com) => {
            if (err){
                console.log('AAAA')
                return next(err)
            }else{
                com.subcomments.push(mongoose.Types.ObjectId(subcomment._id))
                com.save()
                .then((com) => {
                    Comments.findById(com._id)
                    .populate('subcomments')
                    .populate({path:'subcomments',
                        populate:{
                            path:'author',
                            model:'User'
                        }
                    })
                    .then(com => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type' , 'application/json' );
                        res.json({success:true, subcomments:com.subcomments});
                    })
                })
               
                
                
            }
        })


    })
    .catch(err => next(err))
})

albumRouter.route('/:imageId/:commentId/like')
.put(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then((comment) => {
        comment.liked.push(req.user._id)
        comment.save()
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json' );
        res.json({success:true, comment:comment, liked:true});
    })
    
})

albumRouter.route('/:imageId/:commentId/unlike')
.put(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then((comment) => {
        comment.liked.pull(req.user._id)
        comment.save()
  
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json' );
        res.json({success:true, comment:comment, liked:false});
    })
    
})


module.exports = albumRouter;