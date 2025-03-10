const User=require('../models/userModel');
const bcrypt=require('bcrypt');
const session= require('express-session');
const Secret= process.env.SESSION_SECRET;

const registerLoad =async (req,res)=>{

    try{
        
          res.render('register',{ message:" "});
    }
    catch(err){
        
        console.log(err);
    }

}
const register = async (req, res) => {
    try {
        
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.render('register', { message: 'Email is already registered!' });
        }

     
        const existingUserByName = await User.findOne({ name: req.body.name });
        if (existingUserByName) {
            return res.render('register', { message: 'Name is already taken!' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/'+  req.file.filename,
            password: hashpass
        });

        await user.save();
        res.render('save');  
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};


const loadLogin= async(req,res)=>{

    try{
        await res.render('login',{message:" "});
    }
    catch(err){
        console.log(err);
    }

}

const login = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user = userData;  
                res.redirect('/Chat_App/dashboard');  
            } else {
                res.render('login', { message: "Email and Password is Incorrect!" });
            }
        } else {
            res.render('login', { message: "Email and Password is Incorrect!" });
        }
    } catch (err) {
        console.log(err);
    }
};


const logout= async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/Chat_App/dashboard');
    }
    catch(err){
        console.log(err);
    }

};

const loadDashboard= async(req,res)=>{

    try{
        if (req.session.user) {  
            var users= await User.find({_id: {$nin:[req.session.user._id]}});
            res.render('dashboard', { user: req.session.user ,users:users});  
        } else {
            res.redirect('/Chat_App/login');  
        }
    }
    catch(err){
        console.log(err);
    }

}


module.exports={
    register,
    registerLoad,
    loadLogin,
    login,
    logout,
    loadDashboard
}