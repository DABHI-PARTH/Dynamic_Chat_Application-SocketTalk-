const express=require('express');
const bodyparser=require('body-parser');
require('dotenv').config();
const user_route=express();
const path=require('path');
const multer =require('multer');
const userController=require('../controllers/userController')
const session= require('express-session');
const Secret= process.env.SESSION_SECRET;


user_route.use(session({secret:Secret}));
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}));

user_route.set('view engine','ejs'); // seting viewing engine as ejs
user_route.set('views','./views');

user_route.use(express.static('public'));// set public folder

const storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,path.join('./public/images'));
    },
    filename:function(req,file,cb){
        const filename= req.body.name +'_'+Date.now()+'_' + file.originalname  
        cb(null,filename);

    },
});
const upload=multer({storage,limits:{fileSize:5*1024*1024}}).single('image');
user_route.get('/register',userController.registerLoad);
user_route.post('/register',upload,userController.register);

user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.login);
user_route.get('/logout',userController.logout);
user_route.get('/dashboard',userController.loadDashboard);
user_route.get('*',(req,res)=>{
    res.redirect('/Chat_App/login')
});
user_route.post('/save-chat',userController.saveChat)



module.exports=user_route;
