require('dotenv').config();
url=process.env.MONGODB_URI;
const mongoose=require('mongoose');
mongoose.connect(url);
const db=mongoose.connection;

db.on('connected',()=>console.log("Database Connected"));
db.on('disconnected',()=>console.log("Database Connected"));
db.on('error',(error)=>console.error("Database Error"));

module.exports=db;

