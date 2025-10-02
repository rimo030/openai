# 🖥️ OpenAI

OpenAI API를 활용한 WebSocket 기반 실시간 통신 서버입니다.

- [ERD](./prisma/docs/ERD.md)

<br>

## 📚 기술 스택

| 분류      | 기술 스택                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Language  | [![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)]()                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Backend   | [![](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)]() [![](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white)]() [![](https://img.shields.io/badge/Nestia-C21325?style=flat-square&logo=NestJS&logoColor=white)](https://nestia.io/) [![](https://img.shields.io/badge/Typia-3178C6?style=flat-square&logo=TypeScript&logoColor=white)](https://typia.io/) [![](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=Prisma&logoColor=white)]() |
| AI/ML     | [![](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=OpenAI&logoColor=white)]()                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| WebSocket | [![](https://img.shields.io/badge/TGrid-C21325?style=flat-square&logo=NestJS&logoColor=white)](https://github.com/samchon/tgrid)                                                                                                                                                                                                                                                                                                                                                                                                                  |
| DB        | [![](https://img.shields.io/badge/Postgresql-4169E1?style=flat-square&logo=postgresql&logoColor=white)]()                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Testing   | [![](https://img.shields.io/badge/Nestia%20e2e%20Testing-C21325?style=flat-square&logo=NestJS&logoColor=white)](https://nestia.io/docs/sdk/e2e/)                                                                                                                                                                                                                                                                                                                                                                                                  |
| DevOps    | [![](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white)]()                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

<br>

## 🎯 주요 기능

### 🎤 음성 인식 (STT)

- TGrid WebSocket 기반 실시간 음성-텍스트 변환
- OpenAI Whisper 모델 사용
- 세그먼트별 상세 정보 DB 저장 (시작/종료 시간, 신뢰도, 압축 비율 등)

### 💬 채팅

- TGrid WebSocket 기반 실시간 채팅
- 스트리밍 응답 지원
- 일반 응답 및 스트리밍 응답 모두 제공

### 📁 파일 관리

- OpenAI Files API 연동
- 파일 업로드 (base64 인코딩 지원)
- 파일 리스트 조회 (purpose별 필터링)
- Assistants, Fine-tuning 등 다양한 용도 지원

### 🗂️ Vector Store

- Vector Store 생성 및 관리
- 파일 추가/삭제 기능
- Vector Store 리스트 조회
- Vector Store별 파일 리스트 조회
- Vector Store 삭제

### 🤖 RAG (Responses API)

- OpenAI Responses API를 활용한 RAG 구현
- Vector Store 기반 문서 검색 및 응답 생성
- 다중 Vector Store 지원

### 📊 모니터링

- 토큰 사용량 및 비용 추적

<br>

## 🛠️ 프로젝트 실행

로컬에서 아래 방법으로 서버를 실행시킬 수 있습니다.

### 1. 설치

```sh
git clone https://github.com/rimo030/whisper.git
```

```sh
cd whisper
```

```sh
npm i
```

<br>

### 2. 환경 변수 설정

`.env.example` 파일을 참고해 `.env` 환경 변수 파일 세팅

<br>

### 3. 로컬 DB 생성

docker-compose를 이용해 PostgreSQL 컨테이너를 생성합니다.

```sh
docker compose up -d
```

<br>

### 4. DB 스키마 생성

Prisma를 이용해 스키마를 동기화합니다.

```sh
npx prisma db push
```

<br>

### 5. 서버 실행

아래 명령어로 로컬 서버를 실행시킬 수 있습니다.

```sh
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start
```

<br>

## 🛠️ Prisma 명령어

ORM으로 Prisma를 채택하고 있습니다.

- DB 스키마 동기화

```sh
npx prisma db push

# DB 초기화
npx prisma db push --force-reset
```

- Prisma Client 생성

```sh
npx prisma generate
```

<br>

## ⏰ 테스팅

로컬에서 테스트 코드를 실행할 수 있습니다.

### 1. Nestia SDK 생성

```sh
npm run build:sdk
```

<br>

### 2. 테스트 빌드

```sh
npm run build:test
```

<br>

### 3. 테스트 코드 실행

테스트 코드는 [/test](./test)에 작성되고 있습니다.

```sh
npm run test
```

<br>

## 📡 API 사용법

### WebSocket 연결

```typescript
import { IConnection } from '@nestia/fetcher';
import { test_api_web_socket_connect } from './test/features/web-sockets/test_api_web_socket_connect';

const connection: IConnection = {
  host: 'localhost:3000',
};

const { connector, driver } = await test_api_web_socket_connect(connection);
```
