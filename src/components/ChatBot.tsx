import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { generateAIResponse } from "../services/aiService";
import { useTheme } from "../contexts/ThemeContext";
import { AI_MODELS } from "../types/ai";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useFileUpload, UploadedFile } from "../hooks/useFileUpload";
import { exportToPDF, exportToText } from "../utils/exportUtils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  files?: UploadedFile[];
}

const ChatBot: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
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
  const [selectedModel, setSelectedModel] = useState<string>("simple");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  const { uploadedFiles, uploadFile, removeFile, clearFiles, isUploading } =
    useFileUpload();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await generateAIResponse(userMessage, selectedModel);
      return response.text;
    } catch (error) {
      console.error("AI 응답 생성 오류:", error);
      return "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInputText("");
    clearFiles();
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(inputText);

      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  const clearChat = () => {
    localStorage.removeItem("chat-messages");
    setMessages([
      {
        id: `init-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "대화가 초기화되었습니다. 새로운 대화를 시작해보세요!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    clearFiles();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "파일 업로드에 실패했습니다."
      );
    }

    event.target.value = "";
  };

  const handleExport = async (type: "pdf" | "text") => {
    try {
      if (type === "pdf") {
        await exportToPDF(messages);
      } else {
        exportToText(messages);
      }
      setShowExportMenu(false);
    } catch (error) {
      alert("내보내기에 실패했습니다.");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 음성 인식 결과를 입력 텍스트에 반영
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI 챗봇</h2>
        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button
            className="clear-chat"
            onClick={clearChat}
            title="대화 초기화"
          >
            🗑️
          </button>
          <button
            className="model-selector"
            onClick={() => setShowModelSelector(!showModelSelector)}
            title="AI 모델 선택"
          >
            🤖
          </button>
          <button
            className="export-button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="대화 내보내기"
          >
            📤
          </button>
          <div className="status-indicator">
            <span className="status-dot"></span>
            온라인
          </div>
        </div>
        {showModelSelector && (
          <div className="model-selector-dropdown">
            <div className="model-selector-header">
              <h3>AI 모델 선택</h3>
              <button
                className="close-button"
                onClick={() => setShowModelSelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="model-list">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  className={`model-item ${
                    selectedModel === model.id ? "selected" : ""
                  } ${!model.isAvailable ? "disabled" : ""}`}
                  onClick={() => {
                    if (model.isAvailable) {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }
                  }}
                >
                  <div className="model-info">
                    <div className="model-name">{model.name}</div>
                    <div className="model-description">{model.description}</div>
                    <div className="model-provider">{model.provider}</div>
                  </div>
                  {selectedModel === model.id && (
                    <span className="selected-icon">✓</span>
                  )}
                  {!model.isAvailable && (
                    <span className="unavailable-icon">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {showExportMenu && (
          <div className="export-menu-dropdown">
            <div className="export-menu-header">
              <h3>대화 내보내기</h3>
              <button
                className="close-button"
                onClick={() => setShowExportMenu(false)}
              >
                ✕
              </button>
            </div>
            <div className="export-options">
              <button
                className="export-option"
                onClick={() => handleExport("pdf")}
                title="PDF로 내보내기"
              >
                📄 PDF 내보내기
              </button>
              <button
                className="export-option"
                onClick={() => handleExport("text")}
                title="텍스트로 내보내기"
              >
                📝 텍스트 내보내기
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              {message.files && message.files.length > 0 && (
                <div className="message-files">
                  {message.files.map((file) => (
                    <div key={file.id} className="file-item">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="file-preview"
                        />
                      ) : (
                        <div className="file-icon">📄</div>
                      )}
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span className="message-time">
                {message.timestamp instanceof Date
                  ? message.timestamp.toLocaleTimeString()
                  : new Date(message.timestamp).toLocaleTimeString()}
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
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            rows={1}
          />
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="uploaded-file">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="file-preview-small"
                    />
                  ) : (
                    <div className="file-icon-small">📄</div>
                  )}
                  <span className="file-name-small">{file.name}</span>
                  <button
                    className="remove-file"
                    onClick={() => removeFile(file.id)}
                    title="파일 제거"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="input-buttons">
          <div className="input-buttons-left">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={isLoading || isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`file-upload-button ${isUploading ? "uploading" : ""}`}
              title="파일 첨부"
            >
              {isUploading ? "⏳" : "📎"}
            </label>
            {isSpeechSupported && (
              <button
                className={`voice-button ${isListening ? "listening" : ""}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? "음성 인식 중지" : "음성 입력 시작"}
                disabled={isLoading}
              >
                {isListening ? "🔴" : "🎤"}
              </button>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              (!inputText.trim() && uploadedFiles.length === 0) || isLoading
            }
            className="send-button"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
