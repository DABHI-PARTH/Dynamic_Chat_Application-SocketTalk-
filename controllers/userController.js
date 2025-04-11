const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Group= require('../models/groupModel');
const Member= require('../models/memberModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose=require('mongoose');
const { param } = require('../routes/userRoute');

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
                res.cookie(`user`,JSON.stringify(userData));
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
        res.clearCookie('user');
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
        const { sender_id, receiver_id, message, replyTo, repliedMessage } = req.body;

        const chat = new Chat({
            sender_id,
            receiver_id,
            message,
            isReply: replyTo ? true : false,
            repliedTo: replyTo || null,
            repliedMessage: repliedMessage || ''
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

const loadGroups = async (req, res) => {
   
    try{
            if (!req.session.user) {
                return res.redirect('/Chat_App/login');
            }
            const user = req.session.user;
        const users = await User.find({ _id: { $ne: user._id } });
        
         const groups=  await Group.find({creator_id:req.session.user.id});
            res.render('layouts/group',{groups:groups,user,users});

    }
    catch(error){
        console.log(error.message);

    }
};

const createGroup = async (req, res) => {
   
    try{
            if (!req.session.user) {
                return res.redirect('/Chat_App/login');
            }
           const group= new Group({
                creator_id: req.session.user.id,
                name: req.body.name,
                image: 'images/' + req.file.filename,
                limit: req.body.limit

            });
            await group.save();
            return res.redirect('/Chat_App/group');
           

    }
    catch(error){
        console.log(error.message);

    }
};

// Get Members
const getMembers = async (req, res) => {
    try {
        const groupId = req.body.group_id;
        const users = await User.find({ _id: { $nin: [req.session.user._id] } }); 
        const members = await Member.find({ group_id: groupId }); 

        const memberIds = members.map(member => member.user_id.toString()); 

        const response = users.map(user => {
            return {
                ...user.toObject(),
                isMember: memberIds.includes(user._id.toString()) 
            };
        });

        res.status(200).send({ success: true, data: response });
    } catch (error) {
        console.error(error);
        res.status(400).send({ success: false, msg: error.message });
    }
};


const addMembers = async (req, res) => {
    try {
        if (!req.body.members || req.body.members.length === 0) {
            return res.status(200).send({ success: false, msg: 'Please select at least one Member' });
        }

        if (req.body.members.length > parseInt(req.body.limit)) {
            return res.status(200).send({ success: false, msg: 'You cannot select more than ' + req.body.limit + ' Members' });
        }

        await Member.deleteMany({ group_id: req.body.group_id });

        let data = [];
        const members = Array.isArray(req.body.members) ? req.body.members : [req.body.members];

        for (let i = 0; i < members.length; i++) {
            data.push({
                group_id: req.body.group_id,
                user_id: members[i]
            });
        }

        await Member.insertMany(data);

        res.status(200).send({ success: true, msg: 'Members added successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};
const updateChatGroup= async(req,res)=>{
    try{

        if(parseInt(req.body.limit) <parseInt(req.body.last_limit)){
            await  Member.deleteMany({group_id:req.body.id});
        }
        var updateObj;
        if(req.file != undefined){
            updateObj ={
               name:req.body.name, 
               image: 'images/' +req.file.filename, 
               limit:req.body.limit, 
            }

        }else{
            updateObj ={
                name:req.body.name,   
                limit:req.body.limit, 
             }

        }
      await  Group.findByIdAndUpdate({_id:req.body.id},{$set:updateObj});

        res.status(200).send({ success: true, msg: 'Chat Group Updated successfully' });
    }
 catch (error) {
    res.status(400).send({ success: false, msg: error.message });
}
};

const deleteChatGroup= async(req,res)=>{
    try{

        await  Group.deleteOne({_id:req.body.id});
        await  Member.deleteMany({group_id:req.body.id});
    
        res.status(200).send({ success: true, msg: 'Chat Group Deleted successfully' });
    }
 catch (error) {
    res.status(400).send({ success: false, msg: error.message });
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
    updateChat,
    loadGroups,
    createGroup,
    getMembers,
    addMembers,
    updateChatGroup,
    deleteChatGroup,

};
