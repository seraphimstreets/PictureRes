const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const imageSchema = new Schema({
    filename:{
        type:String,
        required:true,
        unique:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
   
    },
    description:{
        type:String,
        default:""
    },
    liked:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  
},{
    timestamps:true
})


var im = mongoose.model('Image', imageSchema);



module.exports = im;