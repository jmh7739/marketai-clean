# MarketAI API Documentation

## 개요
MarketAI 스마트 경매 마켓플레이스의 RESTful API 문서입니다.

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://api.marketai.com`

## 인증
대부분의 API 엔드포인트는 JWT 토큰을 통한 인증이 필요합니다.

### 헤더 형식
```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## 응답 형식
모든 API 응답은 다음 형식을 따릅니다:

### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### 오류 응답
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": []
}
```

## 엔드포인트

### 🔐 인증 (Authentication)

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 📦 상품 (Products)

#### 상품 목록 조회
```http
GET /api/products?page=1&limit=20&category=cat1&search=iPhone
```

#### 상품 등록
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "description": "상품 설명",
  "price": 1200000,
  "categoryId": "cat1-1",
  "condition": "like-new",
  "images": ["image1.jpg", "image2.jpg"]
}
```

### 🔨 경매 (Auctions)

#### 경매 목록 조회
```http
GET /api/auctions?status=active&page=1&limit=20
```

#### 입찰하기
```http
POST /api/auctions/:id/bid
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1100000
}
```

## 웹소켓 이벤트

실시간 ��매를 위한 웹소켓 연결:

```javascript
const socket = io('ws://localhost:3001', {
  auth: {
    token: 'your_jwt_token'
  }
});

// 경매방 참여
socket.emit('join-auction', { auctionId: 'auction1' });

// 새 입찰 수신
socket.on('new-bid', (data) => {
  console.log('새 입찰:', data);
});
```

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `AUTH_REQUIRED` | 401 | 인증이 필요합니다 |
| `INVALID_TOKEN` | 403 | 유효하지 않은 토큰입니다 |
| `PRODUCT_NOT_FOUND` | 404 | 상품을 찾을 수 없습니다 |
| `AUCTION_ENDED` | 400 | 경매가 종료되었습니다 |
| `BID_TOO_LOW` | 400 | 입찰가가 너무 낮습니다 |

더 자세한 API 문서는 [Postman Collection](./postman-collection.json)을 참고하세요.