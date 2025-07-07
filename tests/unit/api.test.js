const request = require('supertest')
const { app } = require('../../apps/api/src/server')

describe('API Tests', () => {
  describe('Health Check', () => {
    test('GET /health should return OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body.status).toBe('OK')
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('Authentication', () => {
    test('POST /api/auth/register should create user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: '테스트유저',
        phone: '010-1234-5678'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
    })

    test('POST /api/auth/login should return token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
    })
  })

  describe('Products', () => {
    let authToken

    beforeAll(async () => {
      // 테스트용 사용자 로그인
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
      
      authToken = loginResponse.body.data.accessToken
    })

    test('GET /api/products should return products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.products).toBeDefined()
      expect(response.body.data.pagination).toBeDefined()
    })

    test('POST /api/products should create product', async () => {
      const productData = {
        title: '테스트 상품',
        description: '테스트용 상품 설명입니다.',
        price: 100000,
        categoryId: 'cat1',
        condition: 'new',
        images: ['test1.jpg', 'test2.jpg'],
        tags: ['테스트', '상품'],
        location: '서울시 강남구'
      }

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer ' + authToken)
        .send(productData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.product.title).toBe(productData.title)
    })
  })

  describe('Auctions', () => {
    test('GET /api/auctions should return auctions list', async () => {
      const response = await request(app)
        .get('/api/auctions')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.auctions).toBeDefined()
    })
  })
})
