// import socketIo from "socket.io-client";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Join from "./components/join";
import Chat from "./components/chat";
import Main from "./components/Main";
import Register from "./components/Register";
import Private from "./components/Private";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/private-chat" element={<Private />} />
        <Route path="/join" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
