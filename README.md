# AI 챗봇 통합 웹 애플리케이션, ChatAI ( 2024. 10 ~ 작업 중)

**Next.js**, **Tailwind CSS**, **TypeScript**, **Firebase**를 사용해 사용자가 AI 챗봇과 상호작용할 수 있는 웹 애플리케이션입니다.

## 기능 요약

### **사용자 인증**: **Firebase Authentication**을 이용한 회원가입, 로그인 및 로그아웃 기능

### **채팅 기능**: 사용자가 AI 챗봇과 실시간으로 채팅할 수 있으며, **Firestore**를 통해 채팅 데이터를 관리

### **피드백 시스템**: 사용자로부터 채팅에 대한 피드백을 받아 **Firestore**에 저장하여 분석

### **사용자 선호도 설정**: 사용자가 테마(라이트/다크)와 언어(영어/한국어)를 설정하고 업데이트할 수 있는 기능

### **반응형 디자인**: **Tailwind CSS**를 활용하여 다양한 기기에서 최적의 사용자 경험 제공

### **상태 관리**: **Redux Toolkit**을 사용해 사용자 인증 상태와 데이터를 효율적으로 관리

### **API 데이터 캐싱**: **TanStack Query**를 이용해 데이터 요청과 캐싱을 관리하여 사용자 경험을 향상

### **사용자 분석**: 사용자 상호작용 데이터를 **Firestore**에 저장하고 분석 가능

## 기술 스택

### **프론트엔드**

[Next.js](https://nextjs.org/): 서버 사이드 렌더링 및 정적 사이트 생성을 지원하는 프레임워크.

[TypeScript](https://www.typescriptlang.org/): 타입 안전성을 제공하여 개발자 경험을 향상.

[Tailwind CSS](https://tailwindcss.com/): 유틸리티 기반의 CSS 프레임워크로 반응형 레이아웃을 손쉽게 구현.

[Redux Toolkit](https://redux-toolkit.js.org/): 인증 및 사용자 데이터 관리를 위한 상태 관리 도구.

[TanStack Query](https://tanstack.com/query): 데이터 요청과 캐싱을 효과적으로 처리.

### **백엔드**

[Firebase Authentication](https://firebase.google.com/products/auth): 사용자 인증 및 관리.

[Firestore](https://firebase.google.com/products/firestore): 실시간 데이터베이스로 채팅 세션, 피드백 및 사용자 분석 데이터를 저장.

[Firebase Cloud Functions](https://firebase.google.com/products/functions): 서버리스 함수로 커스텀 백엔드 로직 구현 (선택 사항).

### **배포**

[Vercel](https://vercel.com/): Next.js 애플리케이션 배포를 위한 플랫폼.

[Firebase Hosting](https://firebase.google.com/products/hosting): 정적 파일 호스팅 및 백엔드 서비스 제공

## 프로젝트 구조도

```
.
└── src/
    ├── app/
    │   ├── auth/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── chat/
    │   │   ├── [sessionId]/
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── profile/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── page.tsx
    │   └── layout.tsx
    ├── components/
    │   ├── atoms/
    │   │   └── ...
    │   ├── containers /
    │   │   └── ...
    │   ├── molecules/
    │   │   └── ...
    │   └── organisms/
    │       └── ...
    ├── hooks/
    │   ├── test/
    │   │   └── ...
    │   └── ...
    ├── lib
    ├── providers
    ├── redux
    └── types
```
