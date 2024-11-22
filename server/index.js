// nextjs tailwind socket io firebase express nodejs prisma postgresql
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import axios from 'axios'
//importing routes
import AuthRoutes from './routes/AuthRoute.js'
import MessageRoutes from './routes/MessageRoutes.js'
import { v2 as cloudinary } from "cloudinary"
// import { PrismaClient } from '@prisma/client'

//configure cloudinary : is v2 from cloudinary but renamed as: cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
})

//used for debugging checking NeonDB connection Locally
// const prisma = new PrismaClient()

// async function testConnection() {
//   try {
//     await prisma.$connect()
//     console.log("Database connection successful")
//   } catch (error) {
//     console.error("Database connection failed:", error)
//     process.exit(1)
//   }
// }
// await testConnection()


const app = express(); 

app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3000', // or whatever your client's URL is
//   methods: ['GET', 'POST'],
//   credentials: true
// }));

app.use(express.json())

//provides images form uploads pointing route to directory also audio
app.use("/uploads/images", express.static("uploads/images"))
app.use("/uploads/recordings", express.static("uploads/recordings"))

//Root route
app.get('/', (req, res) => {
  res.send("Vercel backend API working")
})

//use routes Api routes
//add routes for auth routes
app.use('/api/auth', AuthRoutes)
//add routes for messages
app.use('/api/messages', MessageRoutes)

const PORT = process.env.PORT || 3005; 

const server = app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT:${PORT}`)
})

//Render Keep-alive reloader function helps with instance spin-down: 
const url = "https://whatsappfrontend-balu.onrender.com"; 
const interval = 30000; 
const reloadWebsite = () => {
  axios.get(url)
  .then(response => {
    console.log(`Reloaded website at ${new Date().toUTCString()} : Status Code ${response.status}`); 
  })
  .catch(error => {
    console.log(`Error reloading website at ${new Date().toUTCString()}:`, error.message); 
  });
}; 

setInterval(reloadWebsite, interval)

//if hosting online change origin also for app 
const io = new Server(server, {
  cors: {
      origin:  process.env.FRONTEND_URL || "http://localhost:3000", // Your React app's URL
      methods: ["GET", "POST"],
      credentials: true,
  },
});

//maintaining sockets and users global
//maintain online offline of users here
//each entry is only one time
global.onlineUsers = new Map()

io.on("connection", (socket) => {
  console.log("New client connected");
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    console.log("User added:", userId);
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers:Array.from(onlineUsers.keys())
    })
  });

  //socket for logout page
  socket.on("signout", (id) => {
    onlineUsers.delete(id); 
    socket.broadcast.emit("online-users", {
      onlineUsers:Array.from(onlineUsers.keys())
    })
  })

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        from: data.from,
        message: {
          message: data.message, 
          type: data.type, 
          senderId: data.from, 
          createdAt: new Date(), 
        },
      });
      console.log("Message forwarded to recipient:", data);
    } else {
      console.log("Recipient not found or offline:", data.to);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Remove the disconnected user from onlineUsers
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("User removed from online list:", userId);
        break;
      }
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); 
    console.log("outgoingvoicecall", data, sendUserSocket)
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId, 
        callType: data.callType,  
      })
    }
  })

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); 
    console.log("outvideocall", data, sendUserSocket)
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId, 
        callType: data.callType,  
      })
    }
  })

  //with try catch and errors better code 
  socket.on("reject-voice-call", (data) => {
    try {
      const sendUserSocket = onlineUsers.get(data.from);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("voice-call-rejected");
      } else {
        console.log(`User ${data.from} not found or offline`);
      }
    } catch (error) {
      console.error("Error in reject-voice-call index.js:", error);
    }
  });

  //reject video when clicking reject closes senders video chat window also
  socket.on("reject-video-call", (data) => {
    try {
      const sendUserSocket = onlineUsers.get(data.from);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("video-call-rejected");
      } else {
        console.log(`User ${data.from} not found or offline`);
      }
    } catch (error) {
      console.error("Error in reject-voice-call index.js:", error);
    }
  });

  //this used for voice and video calls 
  socket.on("accept-incoming-call", ({id}) => {
    const sendUserSocket = onlineUsers.get(id); 
    socket.to(sendUserSocket).emit("accept-call")
  })
});


