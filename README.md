# Dynamic Chat Application (SocketTalk)

## Overview

SocketTalk is a real-time chat application built using modern web technologies to facilitate seamless communication between users. The application supports both one-on-one and group chats, allowing users to send and receive messages instantly. It also includes features like user registration, login, real-time user status tracking, and group chat management. Built with **Node.js**, **Socket.IO**, and **MongoDB**, SocketTalk ensures scalability, reliability, and security.

## Features

- **User Registration and Login**: Secure user authentication with email verification and password encryption using Bcrypt.
- **Real-Time Messaging**: Instant message delivery using Socket.IO for both private and group chats.
- **Group Chat Management**: Create, manage, and participate in group chats with admin privileges to add or remove members.
- **User Status Tracking**: Real-time online/offline status updates for all users.
- **Session Management**: Secure session handling using JWT (JSON Web Tokens) and cookies.
- **Responsive UI**: A clean and intuitive user interface that works seamlessly across devices (desktop, tablet, and mobile).
- **Security**: secure password storage, and token-based authentication.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO
- **Database**: MongoDB (with Mongoose for ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: Bcrypt
- **Frontend**: EJS (Embedded JavaScript Templates)
- **Session Management**: Express-Session & Cookies


## Installation

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DABHI-PARTH/Dynamic_Chat_Application-SocketTalk-.git
   cd Dynamic_Chat_Application-SocketTalk-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/sockettalk
   SESSION_SECRET=enter_yoursecretkey
   ```

4. **Start the Application**:
   ```bash
   nodemon app.js
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:4000/Chat_App`.

## Usage

1. **Register**: Create a new account by providing a unique username, email, and password.
2. **Login**: Log in with your credentials to access the chat dashboard.
3. **Start Chatting**:
   - Send and receive messages in real-time.
   - Create or join group chats.
   - Manage group members (if you are an admin).
4. **Track User Status**: See who is online or offline in real-time.
5. **Manage Sessions**: Stay logged in securely with session management.
6. **Add Member**:
   - Admins can add new members to a group by selecting them from the user list.
   
7. **Remove Member**:
   - Admins can remove members from a group by selecting the member.
   
8. **Edit Chat**:
   - Users can edit their own messages.
   - Admins can edit group details like the group name.
  
9. **Delete Chat**:
   - Users can delete their own messages.
   
   

