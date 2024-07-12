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
  groupchatuser: String,
  phone: String,
  from: String,
  whichuser: String,
  timestamp: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  userId: String,
  groupchatuser: String,
  from: String,
  whichuser: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const RegisterUser = mongoose.model("RegisterUser", RegisterSchema);
const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// create array for users
app.use(express.json()); // Parse JSON bodies
const users = [{}];
// use app
app.use(cors());
// route
app.get("/", (req, res) => {
  res.send("Api is working");
});

// API Routes
app.post("/api/register", async (req, res) => {
  try {
    // console.log(req.body);
    const newUser = new RegisterUser(req.body);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/searchinregister/:identifier", async (req, res) => {
  const identifier = req.params.identifier;
  // console.log(identifier); // Log the received identifier for debugging

  if (identifier) {
    // Check if an identifier is provided
    try {
      // Attempt to find user by phone number first
      const register = await RegisterUser.findOne({ phone: identifier });
      // console.log("phone", register); // Log the found user (if any)

      if (register) {
        return res.json(register); // Return user data if found by phone
      }

      // If phone not found, try searching by username
      const registerByUsername = await RegisterUser.findOne({
        user: identifier,
      });
      // console.log("username", registerByUsername); // Log the found user (if any)

      if (registerByUsername) {
        return res.json(registerByUsername); // Return user data if found by username
      }

      // No user found with either identifier
      return res.status(404).json({ message: "User not found" });
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // No identifier provided
    return res.status(400).json({ message: "Missing identifier" });
  }
});

// use io
io.on("connect", (socket) => {
  console.log("new connection");

  // receive the user from frontend
  socket.on("join", async (userData) => {
    // store user names
    let { groupchat, fromchat, withchat } = userData;
    console.log(groupchat, fromchat, withchat);
    users[socket.id] = groupchat !== null ? groupchat : fromchat;

    console.log(`${groupchat !== null ? groupchat : fromchat} has joined`);
    // Store user in MongoDB
    const finduser = await User.findOne({
      $or: [
        { groupchatuser: groupchat },
        { from: fromchat, whichuser: withchat },
      ],
    });

    if (!finduser) {
      console.log("User not found");

      const newUser = new User({
        socketId: socket.id,
        from: fromchat,
        groupchatuser: groupchat,
        whichuser: withchat,
      });

      await newUser.save();
    } else {
      socket.emit("welcome", {
        user: "Admin",
        message: `Welcome From Admin Side: ${users[socket.id]}`,
      });

      // Send user to FrontEnd
      socket.broadcast.emit("userjoined", {
        user: "Admin",
        message: `${users[socket.id]} has joined broadcast`,
      });
    }
    // end
  });
  // return;
  // Receive user message
  socket.on(
    "message",
    async ({ message, id, username, Fromusername, usernamephone }) => {
      console.log(
        `Socket id every time change: ${socket.id} From  ${Fromusername}|groupchatperson : ${username}  | | Message: ${message} | Id: ${id} | Send message to: ${usernamephone}`
      );

      const userss = await User.findOne({
        $or: [
          { groupchatuser: username },
          { from: Fromusername, whichuser: usernamephone },
        ],
      });
      // console.log(userss);
      if (userss) {
        // Store message in MongoDB
        const newMessage = new Message({
          userId: socket.id,
          groupchatuser: username ? username : null,
          from: Fromusername ? Fromusername : null,
          message: message,
          whichuser: usernamephone ? usernamephone : null,
        });
        await newMessage.save();
        // io.emit("sendMessage", { userid: users[id], message, id });
        io.emit("sendMessage", {
          userid: userss.from,
          message,
          whichuser: usernamephone,
          id: socket.id,
        });
      }
    }
  );
  // return;

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
