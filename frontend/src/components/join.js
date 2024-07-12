import React, { useState } from "react";
import { Link } from "react-router-dom";

let userinput = "";
const JoinUser = () => {
  userinput = document.getElementById("joininput").value;
  document.getElementById("joininput").value = "";
};
const Join = () => {
  const [username, setusername] = useState("");
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-blue-500">Hello, ChatApp!</h1>
        <input
          type="text"
          placeholder="Username"
          id="joininput"
          onChange={(e) => setusername(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link to="/chat">
          {" "}
          <button
            onClick={JoinUser}
            className={`px-4 py-2 text-white font-semibold rounded-md ${
              username
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!username}
          >
            Join chat
          </button>
        </Link>
      </div>
    </>
  );
};

export default Join;
export { userinput };
