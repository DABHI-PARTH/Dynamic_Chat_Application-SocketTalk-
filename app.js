const express=require('express');
const app=express();
const db=require('./db')
require('dotenv').config();
let port=process.env.PORT || 3000;
const user_route=require('./routes/userRoute')

app.use('/Chat_App',user_route);
app.listen(port,()=>console.log(`Server Running on port ${port}`));
