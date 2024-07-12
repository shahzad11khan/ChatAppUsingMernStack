import React from "react";

const Main = () => {
  return (
    <>
      {" "}
      <h4 className="text-4xl font-bold text-gray-800  flex justify-center">
        `Shahzad` Chat Application
      </h4>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center gap-2">
        <a href="/register">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
            Register In Chat
          </button>
        </a>

        <a href="/join">
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition">
            Group Chat
          </button>
        </a>

        <a href="/private-chat">
          <button className="w-full px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition">
            Private Chat
          </button>
        </a>
      </div>
    </>
  );
};

export default Main;
