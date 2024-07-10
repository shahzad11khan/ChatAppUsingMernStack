// import socketIo from "socket.io-client";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Join from "./components/join";
import Chat from "./components/chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
