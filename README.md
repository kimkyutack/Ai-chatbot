# 🤖 AI 챗봇 웹앱

무료 AI API와 한글 PDF 내보내기까지 지원하는 챗봇 웹 애플리케이션입니다.  
React + TypeScript 기반으로, 다양한 AI 모델 선택, 다크 모드, 대화 내보내기, 음성 입력, 파일 첨부 등 풍부한 기능을 제공합니다.

## ✨ 주요 기능

- 💬 **실시간 대화**: 사용자와 AI 간의 자연스러운 대화
- 🎨 **모던 UI**: 그라데이션, 애니메이션, 반응형 디자인
- 🌙 **다크 모드**: 버튼 클릭 한 번으로 테마 전환
- 🗂️ **대화 히스토리 저장**: 로컬 스토리지에 자동 저장
- 🤖 **다중 AI 모델 선택**: Hugging Face, OpenAI 등 다양한 AI 연동
- 🗣️ **음성 입력**: 브라우저 음성 인식 지원
- 📎 **파일 첨부**: 이미지, 문서 등 다양한 파일 업로드
- 📤 **대화 내보내기**: PDF(한글 완벽 지원), 텍스트 파일로 내보내기
- 🕐 **타임스탬프**: 각 메시지의 전송 시간 표시

## 🚀 시작하기

### 필수 요구사항

- Node.js (버전 14 이상)
- npm 또는 yarn

### 설치 및 실행

```bash
git clone <repository-url>
cd ai-practice
npm install
npm run start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🛠️ 기술 스택

- **Frontend**: React, TypeScript
- **스타일링**: CSS3 (그라데이션, 애니메이션)
- **AI 연동**: Hugging Face, OpenAI (API 키 필요)
- **PDF 내보내기**: jsPDF (NotoSansKR 폰트로 한글 완벽 지원)
- **음성 인식**: Web Speech API

## 🔧 AI API 연동

### Hugging Face API

1. [Hugging Face](https://huggingface.co/settings/tokens)에서 API 키 발급
2. `.env` 파일에 추가:
   ```
   REACT_APP_HUGGINGFACE_API_KEY=your_api_key_here
   ```
3. `src/services/aiService.ts`에서 Hugging Face API 연동 코드 활성화

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 발급
2. `.env` 파일에 추가:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. `src/services/aiService.ts`에서 OpenAI API 연동 코드 활성화

## 📁 프로젝트 구조

```
ai-practice/
├── public/
│   └── fonts/                # NotoSansKR 한글 폰트 모음
├── src/
│   ├── components/
│   │   └── ChatBot.tsx       # 메인 챗봇 컴포넌트
│   ├── services/
│   │   └── aiService.ts      # AI API 서비스
│   ├── utils/
│   │   ├── exportUtils.ts    # PDF/텍스트 내보내기 (한글 폰트 적용)
│   │   └── fontUtils.ts      # 폰트 base64 변환 유틸
│   ├── hooks/                # 커스텀 훅 모음
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── package.json
└── README.md
```

## 🎨 UI/UX 특징

- **그라데이션 배경**과 **메시지 버블**
- **애니메이션** 및 **타이핑 인디케이터**
- **반응형**: 모바일/데스크톱 모두 최적화

## 📝 한글 PDF 내보내기

- `public/fonts` 폴더에 NotoSansKR-Regular.ttf, NotoSansKR-Bold.ttf 등 한글 폰트 포함
- PDF 내보내기 시 jsPDF에서 base64로 폰트 등록 → 한글/굵은 글씨 완벽 지원

## 🔮 향후 개선 계획

- [ ] 메시지 검색 기능
- [ ] 다중 AI 모델 선택 기능
- [ ] 다크 모드 지원
- [ ] 음성 입력/출력 기능
- [ ] 파일 첨부 기능

## 🤝 기여하기

1. Fork 후 브랜치 생성
2. 기능 개발 및 커밋
3. Pull Request 제출

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [Hugging Face](https://huggingface.co/) - 무료 AI API 제공
- [OpenAI](https://openai.com/) - 혁신적인 AI 기술

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
