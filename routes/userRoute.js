const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const user_route = express();
const path = require('path');
const multer = require('multer');
const userController = require('../controllers/userController')
const session = require('express-session');
const Secret = process.env.SESSION_SECRET;
const cookieParser = require('cookie-parser');

user_route.use(cookieParser());
user_route.use(session({secret: Secret}));
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended: true}));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
         cb(null, path.join('./public/images'));
    },
    filename: function(req, file, cb) {
        const filename = req.body.name + '_' + Date.now() + '_' + file.originalname;  
        cb(null, filename);
    },
});

const upload = multer({storage, limits: {fileSize: 5 * 1024 * 1024}}).single('image');

// Routes
user_route.get('/register', userController.registerLoad);
user_route.post('/register', upload, userController.register);
user_route.get('/login', userController.loadLogin);
user_route.post('/login', userController.login);
user_route.get('/logout', userController.logout);
user_route.get('/dashboard', userController.loadDashboard);

user_route.post('/save-chat', userController.saveChat);
user_route.post('/delete-chat', userController.deleteChat);
user_route.post('/update-chat', userController.updateChat);

user_route.get('/group', userController.loadGroups);
user_route.post('/group', upload, userController.createGroup);
user_route.post('/get-members', userController.getMembers);
user_route.post('/add-members', userController.addMembers);
user_route.post('/update-chat-group', upload, userController.updateChatGroup);
user_route.post('/delete-chat-group', userController.deleteChatGroup);
user_route.get('/share-group/:id', userController.shareGroup);
user_route.post('/join-group', userController.joinGroup);
user_route.get('/group-chat', userController.groupChats);

user_route.post('/delete-profile', userController.deleteProfile);

user_route.post('/group-save-chat', userController.saveGroupChat);
user_route.post('/load-group-chats', userController.loadGroupChats);
user_route.post('/delete-group-chat', userController.deleteGroupChats);
user_route.post('/update-group-chat', userController.updateGroupChats);

user_route.get('*', (req, res) => {
    res.redirect('/Chat_App/login')
});

module.exports = user_route;