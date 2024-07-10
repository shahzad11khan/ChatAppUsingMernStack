const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mongoose = require("mongoose");
// db
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chatapp");
// Create a schema and model for users and messages

const RegisterSchema = new mongoose.Schema({
  socketId: String,
  user: String,
  phone: String,
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  socketId: String,
  user: String,
  phone: String,
  timestamp: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  from: String,
  userId: String,
  whichuser: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const RegisterUser = mongoose.model("RegisterUser", RegisterSchema);
const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// create array for users
const users = [{}];
// use app
app.use(cors());
// route
app.get("/", (req, res) => {
  res.send("Api is working");
});

// use io
io.on("connect", (socket) => {
  console.log("new connection");

  // receive the user from frontend
  socket.on("join", async (user) => {
    // store user names
    users[socket.id] = user;
    console.log(`${user} has joined`);
    // Store user in MongoDB
    const finduser = await User.findOne({ user: user });
    if (!finduser) {
      console.log("user not find");
      const userss = new User({ socketId: socket.id, user: user });
      await userss.save();
    } else {
      console.log("user find");
      socket.emit("welcome", {
        user: "Admin",
        message: `Welcome From Admin Side : ${users[socket.id]}`,
      });
      // Send user to FrontEnd
      socket.broadcast.emit("userjoined", {
        user: "Admin",
        message: `${users[socket.id]} has joined broadCast`,
      });
    }

    // end
  });
  // Receive user message
  socket.on("message", async ({ message, id }) => {
    console.log(`User is: ${users[id]} Message is : ${message} Id is: ${id}`);
    const userss = await User.findOne({ socketId: id });
    if (userss) {
      // Store message in MongoDB
      const newMessage = new Message({
        userId: userss._id,
        message: message,
        whichuser: users[id],
      });
      await newMessage.save();
      io.emit("sendMessage", { userid: users[id], message, id });
    }
  });

  // disconnected user
  socket.on("disconnect", async () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left the broadCast`,
    });
    console.log("user disconnected");
  });
});

// listen the server
server.listen(8000, () => {
  console.log(`Server is running on port: 800`);
});
