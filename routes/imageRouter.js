const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var cors = require('./cors');
const Images = require('../models/Images');
const Users = require('../models/user')
const Albums = require('../models/Albums')
const {Comments} = require('../models/Comments');
const authenticate = require("../authenticate");
const mongoose = require('mongoose');

ObjectId = require('mongodb').ObjectID;
const imageRouter = express.Router()
imageRouter.use(bodyParser.json())

function checkId(list, id){
    for(var i=0;i<list.length;i++){
        if (list[i].equals(id)) return false
    }
    
    return true
}

imageRouter.route('/')
.get(cors.cors, (req,res,next)=>{
  
 
    if (req.query.latest){
        Images.countDocuments({}, (err, count) => {
            console.log(count)
            Images.find({}).sort({'createdAt':-1}).limit(12)
            
            .then((imgs) => {
            
                if(imgs != null){
                    
                        
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json' );

                    res.json({'imList':imgs, 'count':count});
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
        Images.countDocuments({}, (err, count) => {
           
            Images.find({}).sort({'createdAt':-1}).limit((req.query.page+1)*12)
            .then((imgs) => {
                console.log(imgs)
                if(imgs != null){
                    
                        
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json' );

                    res.json({'imList':imgs.slice(req.query.page*12, (req.query.page+1)*12), 'count':count});
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
.delete(cors.cors, (req,res,next)=>{
    Images.remove({})
    .then(resp => {
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.redirect('https:/localhost:3443/resetCounter/?num=0')
    }, err => next(err))
    .catch(err => next(err))
})

imageRouter.route('/detailed/:imageId')
.get(cors.cors, (req,res,next)=>{
    
    Images
  
    .findOne({'_id':req.params.imageId})
    .populate('author')
    .populate('comments')
    .then((img) => {
        console.log(img)
        if(img != null){
                    
            Comments.find({baseImage:req.params.imageId})
            .then((coms) => {
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json' );

                res.json({'img':img, 'numcomments':coms.length});
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
    console.log(req.body);
    Images.create(req.body)
    .then((imgs) => {
        if(img != null){
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json' );
            res.json(imgs)
        }else{
            err = new Error('Images not found!')
            err.status = 404;
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})
.put()
.delete();

imageRouter.route('/imFind/')
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



imageRouter.route('/:imageId/like')
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



imageRouter.route('/:imageId/unlike')
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


imageRouter.route('/:imageId/comments')
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

imageRouter.route('/:imageId/:commentId/subcomment')
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

imageRouter.route('/:imageId/:commentId/like')
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

imageRouter.route('/:imageId/:commentId/unlike')
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


module.exports = imageRouter;