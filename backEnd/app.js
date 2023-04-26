
import express from "express";

import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import userRouter from "./routes/userrouter.js";
import adminRouter from "./routes/adminroutes.js";
import { Server as SocketIO } from "socket.io";
// import storeimage from "./middleware/multer.js";
// import cloudinary from "./utilities/cloudinary";
import fs from "fs";

const app = express();
dotenv.config({ path: "./.env" });
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// app.use(logger("dev"));
app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use("/admin", adminRouter);
const DB = `mongodb://127.0.0.1:27017/serviceApp`;
//database connection
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`databse connected successfully `);
    });

//server port setting
const PORT = process.env.PORT;
const server = app.listen(PORT, (err) => {
    if (err) {
        console.log(`database set`);
    } else {
        console.log(`running at port ${PORT}`);
    }
});

//socket io setting 
const io = new SocketIO(server, {
    cors:{
        origin:'http://localhost:3000',
        credentials:true
    }
} )

global.onlineUsers = new Map();
io.on('connection',(socket) => {
    global.chatsocket = socket;
    socket.on('addUser',(id)=>{
        onlineUsers.set(id, socket.id);
    })

socket.on('send-msg', (data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket){
        socket.to(sendUserSocket).emit('receive-msg', data.message);
    }
})
})

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push ({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user)=> user.userId === userId)
    
}

io.on("connection",(socket) => {

    //connect 
    // io.to(si).emit('welcome', 'this is socket server')
    // take userid an dsocket id from user
    socket.on('addUser',userId =>{
            addUser(userId, socket.id);
            io.emit("getUser",users);
    })

    //send and get nessages
        socket.on('sendMessage', ({senderId, recieverId, text})=>{
            console.log(users,"users");
                const user = getUser(recieverId);
                if(!user) return
                io.to(user.socketId).emit('getMessage', {
                    senderId,
                    text,
                })
        })
    // disconnect
    socket.on('disconnect', ()=>{
        console.log('a user disconnected');
        removeUser(socket.id);
        io.emit("getUser",users);
    })
})

