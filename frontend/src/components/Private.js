import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { setChatFromState, setChatToState } from "./stateManager";
let FromName = "";
let WhichUser = "";
const handleJoinPrivateChat = () => {
  FromName = document.getElementById("username").value;
  document.getElementById("username").value = "";
  WhichUser = document.getElementById("phone").value;
  document.getElementById("phone").value = "";
};
const Private = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Join Private Chat</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Your Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Enter Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phone"
        >
          Chat With
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="text"
          placeholder="Search With Name or Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      <div className="flex items-center justify-between mt-3">
        <Link to="/chat">
          <button
            onClick={handleJoinPrivateChat}
            className={`px-4 py-2 text-white font-semibold rounded-md ${
              username && phone
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!username || !phone}
          >
            Join Private chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Private;
export { FromName, WhichUser };
