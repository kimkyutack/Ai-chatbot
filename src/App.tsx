import "./App.css";
import ChatBot from "./components/ChatBot";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <header className="App-header">
          <h1>🤖 AI 챗봇</h1>
          <p>AI와 대화해보세요!</p>
        </header>
        <main>
          <ChatBot />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
