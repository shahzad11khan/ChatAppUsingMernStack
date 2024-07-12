import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import Message from "./message";
import { userinput } from "./join";

import { FromName, WhichUser } from "./Private";
let socket;
const Endpoint = "http://localhost:8000/";
const Chat = () => {
  // Reload the page once when component mounts

  const [messages, setMessages] = useState([]);
  const [id, setId] = useState("");
  const [inputMessage, setInputMessage] = useState(""); // Separate state for input message
  // console.log("Group User: ", String(userinput));
  // console.log("Private User: ", String(FromName), String(WhichUser));
  let username = String(userinput);
  let Fromusername = String(FromName);
  let usernamephone = String(WhichUser);

  console.log(typeof username, typeof Fromusername, typeof usernamephone);
  if (username !== "") {
    Fromusername = null;
    usernamephone = null;
  } else {
    username = null;
  }
  console.log(username, Fromusername, usernamephone);

  useEffect(() => {
    socket = socketIo(Endpoint, { transports: ["websocket"] });

    // Handle connection and set socket ID
    socket.on("connect", () => {
      //   alert("Connected to server");
      setId(socket.id); // Set the socket ID in state
    });
    console.log(socket); // Set the socket ID in state
    socket.emit("join", {
      groupchat: username,
      fromchat: Fromusername,
      withchat: usernamephone,
    });
    socket.on("userjoined", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(`${data.user}: ${data.message}`);
    });

    socket.on("leave", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(`${data.user}: ${data.message}`);
    });

    // Clean up when component unmounts
    return () => {
      socket.disconnect(); // Disconnect socket when component unmounts
      socket.off(); // Remove all event listeners
    };
  }, []);
  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(id);
      console.log(data.userid, data.message, data.id, data.whichuser);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  const sendMessage = () => {
    const message = document.getElementById("msg").value;
    socket.emit("message", {
      message,
      id,
      username,
      Fromusername,
      usernamephone,
    });
    document.getElementById("msg").value = "";
    setInputMessage("");
  };

  useEffect(() => {
    // Handle server messages
    socket.on("welcome", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(`${data.user}: ${data.message}`);
    });

    return () => {};
  }, [messages]);

  console.log(messages);
  return (
    <div className="flex flex-col justify-between items-center  p-4 w-3/6 m-auto border-2 border-black rounded-xl bg-gray-200">
      <div className="text-center ">
        <h1 className="text-2xl font-bold text-blue-500">
          Welcome,{userinput ? userinput : FromName} Chat With {WhichUser}!
        </h1>
      </div>
      <div className="bg-red-100 h-[400px] w-full overflow-y-scroll p-2">
        {messages.map((item, i) => (
          <Message
            key={i}
            user={item.id === id ? "" : item.userid}
            message={item.message}
          />
        ))}
      </div>
      <div className="w-full max-w-md mt-3">
        <div className="flex items-center">
          <input
            type="text"
            id="msg"
            placeholder="Type your message"
            value={inputMessage} // Controlled input field
            onChange={(e) => setInputMessage(e.target.value)} // Update state with input value
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage() : null
            }
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className={`ml-2 px-4 py-2 text-white font-semibold rounded-md ${
              inputMessage
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!inputMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
