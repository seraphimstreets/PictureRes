const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
   
    },
    content:{
        type:String,
        required:true,
    },
    liked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
   
    }],
    subcomments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
   
    }],
    baseAlbum: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Image'
    }
},{
    timestamps:true
})


exports.Comments = mongoose.model('AlbumComment', commentSchema);
