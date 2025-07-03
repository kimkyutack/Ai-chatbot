# 🤖 AI 챗봇 웹앱

무료 AI API를 활용한 현대적인 챗봇 웹 애플리케이션입니다. React와 TypeScript로 구축되었으며, 다양한 AI 서비스를 쉽게 연동할 수 있습니다.

## ✨ 주요 기능

- 💬 **실시간 대화**: 사용자와 AI 간의 자연스러운 대화
- 🎨 **모던 UI**: 그라데이션과 애니메이션이 적용된 아름다운 인터페이스
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 경험
- ⚡ **타이핑 인디케이터**: AI가 응답을 생성하는 동안 시각적 피드백
- 🔄 **자동 스크롤**: 새 메시지가 올 때마다 자동으로 스크롤
- 🕐 **타임스탬프**: 각 메시지의 전송 시간 표시

## 🚀 시작하기

### 필수 요구사항

- Node.js (버전 14 이상)
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd ai-practice
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run start
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **스타일링**: CSS3 (모던 그라데이션, 애니메이션)
- **HTTP 클라이언트**: Fetch API
- **개발 도구**: Create React App

## 🔧 AI API 연동

현재는 간단한 응답 로직을 사용하고 있지만, 실제 AI API로 쉽게 교체할 수 있습니다.

### 1. Hugging Face API (무료)

1. [Hugging Face](https://huggingface.co/settings/tokens)에서 API 키 발급
2. 프로젝트 루트에 `.env` 파일 생성:
   ```
   REACT_APP_HUGGINGFACE_API_KEY=your_api_key_here
   ```
3. `src/services/aiService.ts`에서 주석 해제:
   ```typescript
   return callHuggingFaceAPI(message);
   ```

### 2. OpenAI API (무료 크레딧 제공)

1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 발급
2. `.env` 파일에 추가:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. `src/services/aiService.ts`에서 주석 해제:
   ```typescript
   return callOpenAIAPI(message);
   ```

## 📁 프로젝트 구조

```
ai-practice/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatBot.tsx      # 메인 챗봇 컴포넌트
│   │   └── ChatBot.css      # 챗봇 스타일
│   │
│   ├── services/
│   │   └── aiService.ts     # AI API 서비스
│   │
│   ├── App.tsx              # 메인 앱 컴포넌트
│   │
│   ├── App.css              # 앱 스타일
│   │
│   └── index.tsx            # 앱 진입점
│
├── package.json
└── README.md
```

## 🎨 UI/UX 특징

- **그라데이션 배경**: 보라색 계열의 아름다운 그라데이션
- **메시지 버블**: 사용자와 AI 메시지를 구분하는 색상과 스타일
- **애니메이션**: 부드러운 전환 효과와 타이핑 인디케이터
- **반응형**: 모든 화면 크기에서 최적화된 레이아웃

## 🔮 향후 개선 계획

- [ ] 대화 히스토리 저장 (로컬 스토리지)
- [ ] 다중 AI 모델 선택 기능
- [ ] 메시지 검색 기능
- [ ] 다크 모드 지원
- [ ] 음성 입력/출력 기능
- [ ] 파일 첨부 기능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [Hugging Face](https://huggingface.co/) - 무료 AI API 제공
- [OpenAI](https://openai.com/) - 혁신적인 AI 기술

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
