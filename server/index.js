const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const _ = require("lodash");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
global.onlineUsersTry = new Map();
let users = {};
io.on("connection", (socket) => {
  let userId = socket.handshake.query.userId; // GET USER ID

  // CHECK IS USER EXHIST
  if (!users[userId]) users[userId] = [];

  // PUSH SOCKET ID FOR PARTICULAR USER ID
  users[userId].push(socket.id);

  // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
  io.sockets.emit("online", userId);
  // DISCONNECT EVENT
  socket.on("disconnect", (reason) => {
    // REMOVE FROM SOCKET USERS
    _.remove(users[userId], (u) => u === socket.id);
    if (users[userId].length === 0) {
      // ISER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
      io.sockets.emit("offline", userId);
      // REMOVE OBJECT
      delete users[userId];
    }
  });

  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("add-online-user", (user) => {
    onlineUsersTry.set(user, socket.id);
    io.emit("update-online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("new-contact", (novoContato) => {
    // Lógica para registrar o novo contato no servidor

    // Emitir evento "new-contact" para todos os clientes, incluindo os detalhes do novo contato
    io.emit("new-contact", novoContato);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
  socket.on("user-logout", (socketId) => {
    for (const [userId, storedSocketId] of onlineUsers) {
      if (storedSocketId === socketId) {
        onlineUsers.delete(userId);
      }
    }
    io.emit("update-online-users", Array.from(onlineUsers.keys()));
  });
  socket.on("disconnect", () => {
    for (const [userId, storedSocketId] of onlineUsers) {
      if (storedSocketId === socket.id) {
        onlineUsers.delete(userId);
        onlineUsersTry.delete(userId);
        io.emit("update-online-users", Array.from(onlineUsers.keys()));
      }
    }
  });
});
