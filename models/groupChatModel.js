const mongoose = require('mongoose');
const GroupChatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    message: {
        type: String,
        required: true
    },
    isReply: {
        type: Boolean,
        default: false
    },
    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        default: null
    },
    repliedMessage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const GroupChat = mongoose.model('GroupChat', GroupChatSchema);
module.exports = GroupChat;