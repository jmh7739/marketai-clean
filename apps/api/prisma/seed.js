const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'cat1',
        name: '전자제품',
        description: '스마트폰, 노트북, 가전제품 등',
        icon: '📱'
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat2',
        name: '패션',
        description: '의류, 신발, 액세서리 등',
        icon: '👕'
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat3',
        name: '홈&리빙',
        description: '가구, 인테리어, 생활용품 등',
        icon: '🏠'
      }
    }),
    prisma.category.create({
      data: {
        id: 'cat4',
        name: '스포츠',
        description: '운동용품, 아웃도어 장비 등',
        icon: '⚽'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user1',
        email: 'seller1@example.com',
        password: hashedPassword,
        name: '김판매자',
        phone: '010-1234-5678',
        address: '서울시 강남구 테헤란로 123',
        rating: 4.8,
        reviewCount: 25,
        isVerified: true
      }
    }),
    prisma.user.create({
      data: {
        id: 'user2',
        email: 'buyer1@example.com',
        password: hashedPassword,
        name: '박구매자',
        phone: '010-2345-6789',
        address: '경기도 성남시 분당구 정자동 789',
        rating: 4.9,
        reviewCount: 32,
        isVerified: true
      }
    }),
    prisma.user.create({
      data: {
        id: 'admin1',
        email: 'admin@marketai.com',
        password: hashedPassword,
        name: '관리자',
        phone: '010-0000-0000',
        role: 'ADMIN',
        isVerified: true
      }
    })
  ])

  console.log('✅ Users created')

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        id: 'prod1',
        title: 'iPhone 15 Pro 256GB 티타늄 블루',
        description: '2024년 3월 구매한 아이폰 15 프로입니다. 거의 새 제품 상태이며, 케이스와 강화유리 필름을 항상 사용했습니다.',
        price: 1200000,
        categoryId: 'cat1',
        sellerId: 'user1',
        condition: 'LIKE_NEW',
        images: ['iphone15pro-1.jpg', 'iphone15pro-2.jpg'],
        tags: ['아이폰', '애플', '스마트폰'],
        location: '서울시 강남구',
        views: 156
      }
    }),
    prisma.product.create({
      data: {
        id: 'prod2',
        title: 'MacBook Pro M3 14인치',
        description: '개발용으로 사용했던 맥북 프로입니다. 성능이 매우 좋고 외관도 깨끗합니다.',
        price: 2500000,
        categoryId: 'cat1',
        sellerId: 'user1',
        condition: 'GOOD',
        images: ['macbook-1.jpg', 'macbook-2.jpg'],
        tags: ['맥북', '애플', '노트북'],
        location: '서울시 강남구',
        views: 89
      }
    })
  ])

  console.log('✅ Products created')

  // Create auctions
  const now = new Date()
  const auction = await prisma.auction.create({
    data: {
      id: 'auction1',
      productId: 'prod1',
      sellerId: 'user1',
      startPrice: 1000000,
      currentPrice: 1150000,
      buyNowPrice: 1300000,
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: 'ACTIVE',
      bidCount: 5
    }
  })

  console.log('✅ Auctions created')

  // Create bids
  await Promise.all([
    prisma.bid.create({
      data: {
        auctionId: 'auction1',
        bidderId: 'user2',
        amount: 1000000,
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.bid.create({
      data: {
        auctionId: 'auction1',
        bidderId: 'user2',
        amount: 1150000,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        isWinning: true
      }
    })
  ])

  console.log('✅ Bids created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })