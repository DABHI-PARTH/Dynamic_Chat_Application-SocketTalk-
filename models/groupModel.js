const mongoose= require('mongoose');
const groupSchema= new mongoose.Schema({
    creator_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    name:{
        type:String,
      
    },
    image:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        required:true
    }
    
},
{timestamps:true}
);


const  Group= mongoose.model('Group',groupSchema);
module.exports=Group;