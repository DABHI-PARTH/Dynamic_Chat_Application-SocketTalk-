const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Dynamic_Chat_App');
const db=mongoose.connection;

db.on('connected',()=>console.log("Database Connected"));
db.on('disconnected',()=>console.log("Database Connected"));
db.on('error',(error)=>console.error("Database Error"));

module.exports=db;

