const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const albumSchema = new Schema({
    title:{
        type:String,
        required:true,
     
    },
    description:{
        type:String,

    },
    tags:[{
        type:String,
       
    }],
    
    author:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    bookmarked:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
},{
    timestamps:true
})



module.exports =  mongoose.model('Album', albumSchema);