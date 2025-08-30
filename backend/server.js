import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";
//creating this http server because soket.io supports http server only

const app = express();
const server = http.createServer(app);

//Initialize soket.io server
export const io = new Server(server,{
    cors:{origin: "*"}
})

//Store online users
export const userSocketMap = {}; // {userId: soketId}

// Soket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId)userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

})

//middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors({
    origin: ['http://localhost:5173', "https://slayerconnect.vercel.app"],
    credentials: true
}));

// Routes setup
app.use("/api/status", (req,res)=> res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to mOngoDB
await connectDB();



const PORT = process.env.PORT || 5010;
server.listen(PORT, ()=> console.log("Server is running on PORT: " + PORT));
