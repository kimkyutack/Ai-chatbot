import React from "react";
import "./App.css";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AI 챗봇</h1>
        <p>무료 AI와 대화해보세요!</p>
      </header>
      <main>
        <ChatBot />
      </main>
    </div>
  );
}

export default App;
