// AI API 서비스
// 현재는 간단한 응답 로직을 사용하지만, 실제 AI API로 쉽게 교체할 수 있습니다

export interface AIResponse {
  text: string;
  confidence?: number;
}

// Hugging Face API를 사용하는 예시 (무료)
export const callHuggingFaceAPI = async (
  message: string
): Promise<AIResponse> => {
  // 실제 사용시에는 Hugging Face API 키가 필요합니다
  // https://huggingface.co/settings/tokens 에서 무료로 발급 가능

  const API_URL =
    "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
  const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY; // .env 파일에 저장

  if (!API_KEY) {
    throw new Error("Hugging Face API 키가 설정되지 않았습니다.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    if (!response.ok) {
      throw new Error("API 요청에 실패했습니다.");
    }

    const data = await response.json();
    return {
      text: data[0]?.generated_text || "응답을 생성할 수 없습니다.",
      confidence: 0.8,
    };
  } catch (error) {
    console.error("Hugging Face API 오류:", error);
    throw error;
  }
};

// OpenAI API를 사용하는 예시 (무료 크레딧 제공)
export const callOpenAIAPI = async (message: string): Promise<AIResponse> => {
  // 실제 사용시에는 OpenAI API 키가 필요합니다
  // https://platform.openai.com/api-keys 에서 발급 가능 (무료 크레딧 제공)

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // .env 파일에 저장

  if (!API_KEY) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 한국어로 대화해주세요.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("API 요청에 실패했습니다.");
    }

    const data = await response.json();
    return {
      text: data.choices[0]?.message?.content || "응답을 생성할 수 없습니다.",
      confidence: data.choices[0]?.finish_reason === "stop" ? 0.9 : 0.7,
    };
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    throw error;
  }
};

export const generateSimpleResponse = async (
  message: string
): Promise<AIResponse> => {
  // 실제 AI API 대신 사용하는 간단한 응답 시스템
  const responses = [
    "흥미로운 질문이네요! 더 자세히 설명해주세요.",
    "그것에 대해 생각해보겠습니다. 다른 관점에서도 살펴볼까요?",
    "좋은 지적입니다! 이 주제에 대해 더 알고 싶으신가요?",
    "그런 질문을 하시다니 정말 좋네요. 함께 탐구해보죠!",
    "흥미로운 주제입니다. 더 구체적으로 말씀해주세요.",
    "그것에 대해 제가 도움을 드릴 수 있을 것 같습니다.",
    "좋은 질문이에요! 이에 대해 더 자세히 알아보고 싶으신가요?",
    "그런 관점은 처음이네요. 더 설명해주세요!",
    "정말 흥미로운 주제네요. 어떤 부분이 궁금하신가요?",
    "그것에 대해 더 자세히 알아보고 싶으시군요. 어떤 관점에서 접근하고 싶으신가요?",
  ];

  // 메시지 길이와 내용에 따라 다른 응답 선택
  const messageLength = message.length;
  const hasQuestion =
    message.includes("?") ||
    message.includes("무엇") ||
    message.includes("어떻게");

  let selectedResponse;
  if (hasQuestion) {
    selectedResponse = responses[Math.floor(Math.random() * 5)]; // 질문형 응답
  } else if (messageLength > 50) {
    selectedResponse = responses[Math.floor(Math.random() * 3) + 5]; // 긴 메시지용 응답
  } else {
    selectedResponse = responses[Math.floor(Math.random() * responses.length)]; // 랜덤 응답
  }

  // 약간의 지연을 추가해서 실제 AI 응답처럼 보이게 함
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  return {
    text: selectedResponse,
    confidence: 0.8,
  };
};

// 기본 AI 서비스 (현재는 간단한 응답 사용)
export const generateAIResponse = async (
  message: string,
  modelId: string = "simple"
): Promise<AIResponse> => {
  switch (modelId) {
    case "huggingface":
      return callHuggingFaceAPI(message);
    case "openai":
      return callOpenAIAPI(message);
    case "simple":
    default:
      return generateSimpleResponse(message);
  }
};
