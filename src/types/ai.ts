export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  isAvailable: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "simple",
    name: "간단한 응답",
    description: "기본적인 응답 로직",
    provider: "Local",
    isAvailable: true,
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "무료 AI 모델",
    provider: "Hugging Face",
    isAvailable: false,
  },
  {
    id: "openai",
    name: "OpenAI GPT",
    description: "GPT 모델",
    provider: "OpenAI",
    isAvailable: false,
  },
];
