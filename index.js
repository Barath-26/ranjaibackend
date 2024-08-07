import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
// import Chat from './models/chat.js';
// import userChats from './models/userChats.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
    origin: process.env.CLIENT_URL,
}));

app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('newChat', async (data) => {
        const { userId, text } = data;

        if (!userId || !text) {
            socket.emit('error', 'UserId and text are required');
            return;
        }

        // try {
        //     const newChat = new Chat({
        //         userId: userId,
        //         history: [{ role: 'user', parts: [{ text }] }],
        //     });
        //     const savedChat = await newChat.save();

        //     const link = `http://localhost:5173/dashboard/chats/${savedChat._id}`;
        //     newChat.link = link;
        //     await newChat.save();

        //     const userChats = await UserChats.findOne({ userId: userId });

        //     if (!userChats) {
        //         const newUserChats = new UserChats({
        //             userId: userId,
        //             chats: [{ _id: savedChat._id, title: text.substring(0, 36) }],
        //         });
        //         await newUserChats.save();
        //     } else {
        //         userChats.chats.push({ _id: savedChat._id, title: text.substring(0, 36) });
        //         await userChats.save();
        //     }

        //     socket.emit('chatSaved', { chatId: savedChat._id, chatLink: link });
        // } catch (err) {
        //     console.error('Error creating chat:', err);
        //     socket.emit('error', 'Error creating chat');
        // }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(port,'0.0.0.0', () => {
    connect();
    console.log(`Server running on port ${port}`);
});
