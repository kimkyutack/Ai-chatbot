import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { generateAIResponse } from "../services/aiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 저는 AI 챗봇입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.find((message) => message.sender === "user")) {
      scrollToBottom();
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await generateAIResponse(userMessage);
      return response.text;
    } catch (error) {
      console.error("AI 응답 생성 오류:", error);
      return "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(inputText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI 챗봇</h2>
        <div className="status-indicator">
          <span className="status-dot"></span>
          온라인
        </div>
      </div>

      <div className="messages-container" ref={messagesEndRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          className="send-button"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
