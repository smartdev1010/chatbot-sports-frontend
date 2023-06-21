import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import ChatBox from "./components/chatbox";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBox />} />
      </Routes>
    </Router>
  );
}

export default App;
