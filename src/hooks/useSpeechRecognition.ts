import { useState, useEffect, useCallback } from "react";

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Web Speech API 지원 여부 확인
    setIsSupported(
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    );
  }, []);

  const recognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ko-KR";

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    const recognitionInstance = recognition();
    if (!recognitionInstance) return;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionInstance.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요."
        );
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionInstance.start();
    } catch (error) {
      console.error("음성 인식 시작 오류:", error);
      setIsListening(false);
    }
  }, [isSupported, recognition]);

  const stopListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
};
