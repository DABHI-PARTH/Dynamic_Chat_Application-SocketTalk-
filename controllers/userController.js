const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');
const session = require('express-session');

const registerLoad = async (req, res) => {
    try {
        res.render('register', { message: " " });
    } catch (err) {
        console.log(err);
    }
};

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
            image: 'images/' + req.file.filename,
            password: hashpass
        });

        await user.save();
        res.render('save');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

const loadLogin = async (req, res) => {
    try {
        await res.render('login', { message: " " });
    } catch (err) {
        console.log(err);
    }
};

const login = async (req, res) => {
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
                res.render('login', { message: "Email and Password are Incorrect!" });
            }
        } else {
            res.render('login', { message: "Email and Password are Incorrect!" });
        }
    } catch (err) {
        console.log(err);
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/Chat_App/login');
    } catch (err) {
        console.log(err);
    }
};

const loadDashboard = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/Chat_App/login');
        }

        const user = req.session.user;
        const users = await User.find({ _id: { $ne: user._id } });

        res.render('dashboard', { user, users });
    } catch (err) {
        console.log(err);
    }
};

const saveChat = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;

        const chat = new Chat({
            sender_id,
            receiver_id,
            message
        });

        await chat.save();

        res.json({
            success: true,
            data: chat
        });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: 'Failed to save chat' });
    }
};

const deleteChat = async (req, res) => {
    try {
        await Chat.deleteOne({_id:req.body.id});
        res.status(200).send({ success: true });

    } catch (error) {
        res.status(400).send({ success: false,msg:error.message });
    }
};
const updateChat = async (req, res) => {
    try {

        await  Chat.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                message: req.body.message
            }
        })

        res.status(200).send({ success: true });

    } catch (error) {
        res.status(400).send({ success: false,msg:error.message });
    }
};




module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard,
    saveChat,
    deleteChat,
    updateChat
    
};
