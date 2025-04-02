const express=require('express');
const app=express();
const db=require('./db')
require('dotenv').config();
const User= require('./models/userModel');
const Chat =require('./models/chatModel');
let port=process.env.PORT || 3000;
const user_route=require('./routes/userRoute')

app.use('/Chat_App',user_route);
const server=app.listen(port,()=>console.log(`Server Running on port ${port}`));

const io=require('socket.io')(server);
var usp=io.of('/user-namespace');
usp.on('connection',async (socket)=>{
    console.log("User Connected");
    var userId = socket.handshake.auth.token
   await User.findByIdAndUpdate({_id: userId},{$set:{is_online:'Online'}});

    socket.broadcast.emit('getOnlineUser',{user_id:userId});
    

    socket.on('disconnect',async()=>{
        console.log("User Disonnected");
        await User.findByIdAndUpdate({_id: userId},{$set:{is_online:'Offline'}});
       socket.broadcast.emit('getOfflineUser',{user_id:userId});
      
    });

    socket.on('newChat',function(data){
        socket.broadcast.emit('loadNewChat',data);
    })
    
    socket.on('oldChat',async(data)=>{
    var chats= await Chat.find({$or:[
            {
                sender_id:data.sender_id,
                receiver_id:data.receiver_id
            },
            {
                sender_id:data.receiver_id,
                receiver_id:data.sender_id
            },
        ]});
        socket.emit('loadChats',{chats:chats});
    });
   
   socket.on('ChatDeleted',function(data){
           
        socket.broadcast.emit('chatmsgdel',data);
   });
   socket.on('chatUpdated',function(data){
    
         socket.broadcast.emit('chatMessageUpdated',data);
    });
    
    
});