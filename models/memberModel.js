const mongoose= require('mongoose');
const memberSchema= new mongoose.Schema({
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    
},
{timestamps:true}
);


const Member= mongoose.model('Member',memberSchema);
module.exports=Member;