const fs = require('fs');
const path = require('path');

// 추가 파일 내용 정의
const additionalFiles = {
  // ==================== PRISMA SCHEMA ====================
  
  'apps/api/prisma/schema.prisma': `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  name          String
  avatar        String?
  phone         String?
  address       String?
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  isVerified    Boolean  @default(false)
  isActive      Boolean  @default(true)
  role          Role     @default(USER)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  products      Product[]
  auctions      Auction[]
  bids          Bid[]
  reviews       Review[] @relation("UserReviews")
  receivedReviews Review[] @relation("UserReceivedReviews")
  messages      Message[] @relation("UserMessages")
  notifications Notification[]
  productLikes  ProductLike[]

  @@map("users")
}

model Category {
  id          String    @id @default(cuid())
  name        String
  description String?
  icon        String?
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

model Product {
  id          String        @id @default(cuid())
  title       String
  description String
  price       Float
  images      String[]
  condition   Condition
  status      ProductStatus @default(ACTIVE)
  views       Int           @default(0)
  tags        String[]
  location    String?
  
  // Relations
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  sellerId    String
  seller      User     @relation(fields: [sellerId], references: [id])
  auction     Auction?
  likes       ProductLike[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

model Auction {
  id           String        @id @default(cuid())
  startPrice   Float
  currentPrice Float
  buyNowPrice  Float?
  reservePrice Float?
  startTime    DateTime
  endTime      DateTime
  status       AuctionStatus @default(UPCOMING)
  bidCount     Int           @default(0)
  autoExtend   Boolean       @default(true)
  winnerId     String?
  
  // Relations
  productId    String  @unique
  product      Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  sellerId     String
  seller       User    @relation(fields: [sellerId], references: [id])
  winner       User?   @relation("AuctionWinner", fields: [winnerId], references: [id])
  bids         Bid[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("auctions")
}

model Bid {
  id          String   @id @default(cuid())
  amount      Float
  timestamp   DateTime @default(now())
  isWinning   Boolean  @default(false)
  isAutoBid   Boolean  @default(false)
  maxAmount   Float?
  
  // Relations
  auctionId   String
  auction     Auction @relation(fields: [auctionId], references: [id], onDelete: Cascade)
  bidderId    String
  bidder      User    @relation(fields: [bidderId], references: [id])
  
  @@map("bids")
}

model ProductLike {
  userId    String
  productId String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@id([userId, productId])
  @@map("product_likes")
}

model Review {
  id         String   @id @default(cuid())
  rating     Int
  comment    String
  productId  String?
  
  // Relations
  reviewerId String
  reviewer   User @relation("UserReviews", fields: [reviewerId], references: [id])
  revieweeId String
  reviewee   User @relation("UserReceivedReviews", fields: [revieweeId], references: [id])
  
  createdAt  DateTime @default(now())

  @@map("reviews")
}

model Message {
  id         String      @id @default(cuid())
  content    String
  type       MessageType @default(TEXT)
  isRead     Boolean     @default(false)
  
  // Relations
  senderId   String
  sender     User @relation("UserMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User @relation("UserReceivedMessages", fields: [receiverId], references: [id])
  
  createdAt  DateTime @default(now())

  @@map("messages")
}

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false)
  
  // Relations
  userId    String
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())

  @@map("notifications")
}

// Enums
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum Condition {
  NEW
  LIKE_NEW
  GOOD
  FAIR
  POOR
}

enum ProductStatus {
  ACTIVE
  SOLD
  INACTIVE
}

enum AuctionStatus {
  UPCOMING
  ACTIVE
  ENDED
  CANCELLED
}

enum MessageType {
  TEXT
  IMAGE
  SYSTEM
}

enum NotificationType {
  BID
  AUCTION_END
  MESSAGE
  SYSTEM
  OUTBID
}`,

  'apps/api/prisma/seed.js': `const { PrismaClient } = require('@prisma/client')
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
  })`,

  // ==================== TYPESCRIPT CONFIGS ====================
  
  'apps/web/tsconfig.json': `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'apps/api/tsconfig.json': `{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`,

  'apps/web/postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  // ==================== ADDITIONAL COMPONENTS ====================
  
  'apps/web/components/FeaturedAuctions.tsx': `'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, Heart, Gavel } from 'lucide-react'
import { Button } from '../../../packages/ui/src/components/Button'
import { Card, CardContent } from '../../../packages/ui/src/components/Card'

interface Auction {
  id: string
  title: string
  currentPrice: number
  startPrice: number
  endTime: string
  image: string
  bidCount: number
  views: number
  isLiked: boolean
  timeLeft: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

export function FeaturedAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAuctions: Auction[] = [
      {
        id: '1',
        title: 'iPhone 15 Pro 256GB 티타늄 블루',
        currentPrice: 1150000,
        startPrice: 1000000,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/placeholder.svg?height=200&width=200',
        bidCount: 8,
        views: 156,
        isLiked: false,
        timeLeft: { days: 2, hours: 5, minutes: 30, seconds: 45 }
      },
      {
        id: '2',
        title: 'MacBook Pro M3 14인치 스페이스 그레이',
        currentPrice: 2500000,
        startPrice: 2200000,
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/placeholder.svg?height=200&width=200',
        bidCount: 12,
        views: 89,
        isLiked: true,
        timeLeft: { days: 1, hours: 12, minutes: 15, seconds: 20 }
      },
      {
        id: '3',
        title: '나이키 에어맥스 270 리액트 한정판',
        currentPrice: 165000,
        startPrice: 150000,
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        image: '/placeholder.svg?height=200&width=200',
        bidCount: 5,
        views: 234,
        isLiked: false,
        timeLeft: { days: 0, hours: 3, minutes: 45, seconds: 10 }
      },
      {
        id: '4',
        title: '삼성 갤럭시 S24 Ultra 512GB',
        currentPrice: 1050000,
        startPrice: 950000,
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        image: '/placeholder.svg?height=200&width=200',
        bidCount: 15,
        views: 123,
        isLiked: true,
        timeLeft: { days: 0, hours: 4, minutes: 20, seconds: 35 }
      }
    ]

    setTimeout(() => {
      setAuctions(mockAuctions)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  const formatTimeLeft = (timeLeft: Auction['timeLeft']) => {
    if (timeLeft.days > 0) {
      return \`\${timeLeft.days}일 \${timeLeft.hours}시간\`
    } else if (timeLeft.hours > 0) {
      return \`\${timeLeft.hours}시간 \${timeLeft.minutes}분\`
    } else {
      return \`\${timeLeft.minutes}분 \${timeLeft.seconds}초\`
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">인기 경매</h2>
            <p className="text-lg text-gray-600">지금 가장 인기 있는 경매 상품들을 확인해보세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 인기 경매</h2>
          <p className="text-lg text-gray-600">지금 가장 인기 있는 경매 상품들을 확인해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {auctions.map((auction) => (
            <Card key={auction.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className={\`h-4 w-4 \${auction.isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}\`} />
                </button>
                <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⏰ {formatTimeLeft(auction.timeLeft)}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {auction.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">현재가</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(auction.currentPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">시작가</span>
                    <span className="text-sm text-gray-600">
                      {formatPrice(auction.startPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Gavel className="h-4 w-4" />
                    <span>{auction.bidCount}회 입찰</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{auction.views}</span>
                  </div>
                </div>

                <Link href={\`/auctions/\${auction.id}\`}>
                  <Button className="w-full">
                    입찰하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/auctions">
            <Button variant="outline" size="lg" className="px-8">
              모든 경매 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}`,

  'apps/web/components/Categories.tsx': `'use client'

import Link from 'next/link'
import { Card, CardContent } from '../../../packages/ui/src/components/Card'

interface Category {
  id: string
  name: string
  icon: string
  count: number
  description: string
}

export function Categories() {
  const categories: Category[] = [
    {
      id: 'electronics',
      name: '전자제품',
      icon: '📱',
      count: 1250,
      description: '스마트폰, 노트북, 가전제품'
    },
    {
      id: 'fashion',
      name: '패션',
      icon: '👕',
      count: 890,
      description: '의류, 신발, 액세서리'
    },
    {
      id: 'home',
      name: '홈&리빙',
      icon: '🏠',
      count: 650,
      description: '가구, 인테리어, 생활용품'
    },
    {
      id: 'sports',
      name: '스포츠',
      icon: '⚽',
      count: 420,
      description: '운동용품, 아웃도어'
    },
    {
      id: 'books',
      name: '도서',
      icon: '📚',
      count: 380,
      description: '책, 잡지, 전자책'
    },
    {
      id: 'cars',
      name: '자동차',
      icon: '🚗',
      count: 290,
      description: '자동차, 오토바이, 부품'
    },
    {
      id: 'beauty',
      name: '뷰티',
      icon: '💄',
      count: 520,
      description: '화장품, 향수, 미용기기'
    },
    {
      id: 'toys',
      name: '완구',
      icon: '🧸',
      count: 340,
      description: '장난감, 게임, 취미용품'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">카테고리별 탐색</h2>
          <p className="text-lg text-gray-600">관심 있는 카테고리에서 원하는 상품을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={\`/categories/\${category.id}\`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                    {category.count.toLocaleString()}개 상품
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            모든 카테고리 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}`,

  'apps/web/components/HowItWorks.tsx': `'use client'

import { Search, Gavel, CreditCard, Package } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: '상품 검색',
      description: '원하는 상품을 검색하거나 카테고리에서 찾아보세요',
      color: 'bg-blue-500'
    },
    {
      icon: Gavel,
      title: '경매 참여',
      description: '실시간으로 입찰에 참여하고 경쟁해보세요',
      color: 'bg-green-500'
    },
    {
      icon: CreditCard,
      title: '안전한 결제',
      description: '낙찰 후 안전한 결제 시스템으로 거래하세요',
      color: 'bg-purple-500'
    },
    {
      icon: Package,
      title: '상품 수령',
      description: '안전하게 포장된 상품을 받아보세요',
      color: 'bg-orange-500'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">이용 방법</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MarketAI에서 경매에 참여하는 방법은 간단합니다. 
            4단계만 따라하면 원하는 상품을 경매로 구매할 수 있어요.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {/* Step Number */}
                  <div className="flex flex-col items-center text-center">
                    <div className={\`relative mb-6 \${step.color} rounded-full p-6 shadow-lg\`}>
                      <Icon className="h-8 w-8 text-white" />
                      <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 왜 MarketAI를 선택해야 할까요?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="font-semibold text-gray-900 mb-2">안전한 거래</h4>
                <p className="text-gray-600 text-sm">에스크로 시스템으로 안전하게 거래하세요</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">실시간 경매</h4>
                <p className="text-gray-600 text-sm">실시간으로 진행되는 스릴 넘치는 경매</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🤖</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI 추천</h4>
                <p className="text-gray-600 text-sm">개인 맞춤형 상품 추천 서비스</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}`,

  // ==================== API ROUTES ====================
  
  'apps/api/src/routes/auctions.js': `const express = require('express')
const { body, query, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { asyncHandler } = require('../middleware/errorHandler')
const { authenticateToken, optionalAuth } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all auctions
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['upcoming', 'active', 'ended', 'cancelled']),
  query('category').optional().isString(),
  query('sortBy').optional().isIn(['newest', 'ending_soon', 'price_low', 'price_high', 'popular'])
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const {
    page = 1,
    limit = 20,
    status = 'active',
    category,
    sortBy = 'ending_soon'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  // Build where clause
  const where = {
    status: status.toUpperCase()
  }

  if (category) {
    where.product = {
      categoryId: category
    }
  }

  // Build orderBy clause
  let orderBy = {}
  switch (sortBy) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'ending_soon':
      orderBy = { endTime: 'asc' }
      break
    case 'price_low':
      orderBy = { currentPrice: 'asc' }
      break
    case 'price_high':
      orderBy = { currentPrice: 'desc' }
      break
    case 'popular':
      orderBy = { bidCount: 'desc' }
      break
    default:
      orderBy = { endTime: 'asc' }
  }

  const [auctions, total] = await Promise.all([
    prisma.auction.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true
              }
            }
          }
        },
        bids: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            bidder: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.auction.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      auctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

// Get single auction
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params

  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rating: true,
              reviewCount: true
            }
          }
        }
      },
      bids: {
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          bidder: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      winner: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  res.json({
    success: true,
    data: { auction }
  })
}))

// Create auction
router.post('/', [
  body('productId').isUUID(),
  body('startPrice').isFloat({ min: 0 }),
  body('buyNowPrice').optional().isFloat({ min: 0 }),
  body('reservePrice').optional().isFloat({ min: 0 }),
  body('duration').isInt({ min: 1, max: 30 }), // days
  body('autoExtend').optional().isBoolean()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const {
    productId,
    startPrice,
    buyNowPrice,
    reservePrice,
    duration,
    autoExtend = true
  } = req.body

  // Check if product exists and user owns it
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { auction: true }
  })

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    })
  }

  if (product.sellerId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to create auction for this product'
    })
  }

  if (product.auction) {
    return res.status(400).json({
      success: false,
      error: 'Product already has an auction'
    })
  }

  // Create auction
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + duration * 24 * 60 * 60 * 1000)

  const auction = await prisma.auction.create({
    data: {
      productId,
      sellerId: req.user.id,
      startPrice: parseFloat(startPrice),
      currentPrice: parseFloat(startPrice),
      buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
      reservePrice: reservePrice ? parseFloat(reservePrice) : null,
      startTime,
      endTime,
      autoExtend,
      status: 'ACTIVE'
    },
    include: {
      product: {
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  res.status(201).json({
    success: true,
    message: 'Auction created successfully',
    data: { auction }
  })
}))

// Place bid
router.post('/:id/bid', [
  body('amount').isFloat({ min: 0 }),
  body('isAutoBid').optional().isBoolean(),
  body('maxAmount').optional().isFloat({ min: 0 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { id } = req.params
  const { amount, isAutoBid = false, maxAmount } = req.body

  // Get auction with current highest bid
  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          seller: true
        }
      },
      bids: {
        orderBy: { amount: 'desc' },
        take: 1
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  // Check auction status
  if (auction.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      error: 'Auction is not active'
    })
  }

  // Check if auction has ended
  if (new Date() > auction.endTime) {
    return res.status(400).json({
      success: false,
      error: 'Auction has ended'
    })
  }

  // Check if user is not the seller
  if (auction.product.sellerId === req.user.id) {
    return res.status(400).json({
      success: false,
      error: 'Cannot bid on your own auction'
    })
  }

  // Check minimum bid amount
  const minBidAmount = auction.currentPrice + 1000 // Minimum increment
  if (parseFloat(amount) < minBidAmount) {
    return res.status(400).json({
      success: false,
      error: \`Bid must be at least \${minBidAmount.toLocaleString()}원\`
    })
  }

  // Create bid and update auction
  const [bid, updatedAuction] = await prisma.$transaction(async (tx) => {
    // Mark previous winning bids as not winning
    await tx.bid.updateMany({
      where: {
        auctionId: id,
        isWinning: true
      },
      data: {
        isWinning: false
      }
    })

    // Create new bid
    const newBid = await tx.bid.create({
      data: {
        auctionId: id,
        bidderId: req.user.id,
        amount: parseFloat(amount),
        isAutoBid,
        maxAmount: maxAmount ? parseFloat(maxAmount) : null,
        isWinning: true
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update auction
    const updated = await tx.auction.update({
      where: { id },
      data: {
        currentPrice: parseFloat(amount),
        bidCount: { increment: 1 }
      }
    })

    return [newBid, updated]
  })

  // TODO: Send real-time notification via WebSocket
  // TODO: Send email notification to previous highest bidder

  res.json({
    success: true,
    message: 'Bid placed successfully',
    data: {
      bid,
      auction: updatedAuction
    }
  })
}))

// End auction (admin or seller only)
router.post('/:id/end', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params

  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: true,
      bids: {
        where: { isWinning: true },
        include: {
          bidder: true
        }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  // Check permissions
  if (auction.product.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to end this auction'
    })
  }

  if (auction.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      error: 'Auction is not active'
    })
  }

  // End auction
  const winningBid = auction.bids[0]
  const updatedAuction = await prisma.auction.update({
    where: { id },
    data: {
      status: 'ENDED',
      winnerId: winningBid?.bidderId || null
    }
  })

  // Update product status
  await prisma.product.update({
    where: { id: auction.productId },
    data: {
      status: winningBid ? 'SOLD' : 'ACTIVE'
    }
  })

  res.json({
    success: true,
    message: 'Auction ended successfully',
    data: { auction: updatedAuction }
  })
}))

module.exports = router`,

  'apps/api/src/routes/categories.js': `const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    },
    where: {
      parentId: null // Only get top-level categories
    },
    orderBy: {
      name: 'asc'
    }
  })

  res.json({
    success: true,
    data: { categories }
  })
}))

// Get single category
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    }
  })

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    })
  }

  res.json({
    success: true,
    data: { category }
  })
}))

// Get category products
router.get('/:id/products', asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    page = 1,
    limit = 20,
    sortBy = 'newest'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  // Build orderBy clause
  let orderBy = {}
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'price_low':
      orderBy = { price: 'asc' }
      break
    case 'price_high':
      orderBy = { price: 'desc' }
      break
    case 'popular':
      orderBy = { views: 'desc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: id,
        status: 'ACTIVE'
      },
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true
          }
        },
        auction: {
          select: {
            id: true,
            currentPrice: true,
            endTime: true,
            status: true,
            bidCount: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    }),
    prisma.product.count({
      where: {
        categoryId: id,
        status: 'ACTIVE'
      }
    })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

module.exports = router`,

  'apps/api/src/routes/upload.js': `const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,webp').split(',')
    const fileExt = path.extname(file.originalname).toLowerCase().slice(1)
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true)
    } else {
      cb(new Error(\`File type .\${fileExt} is not allowed\`), false)
    }
  }
})

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../uploads/images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Upload images
router.post('/images', authenticateToken, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files uploaded'
    })
  }

  const uploadedFiles = []

  for (const file of req.files) {
    try {
      const fileId = uuidv4()
      const fileName = \`\${fileId}.webp\`
      const filePath = path.join(uploadDir, fileName)

      // Process image with sharp
      await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(filePath)

      // Generate thumbnail
      const thumbnailName = \`\${fileId}_thumb.webp\`
      const thumbnailPath = path.join(uploadDir, thumbnailName)
      
      await sharp(file.buffer)
        .resize(200, 200, {
          fit: 'cover'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath)

      uploadedFiles.push({
        id: fileId,
        originalName: file.originalname,
        fileName,
        thumbnailName,
        url: \`/uploads/images/\${fileName}\`,
        thumbnailUrl: \`/uploads/images/\${thumbnailName}\`,
        size: file.size,
        mimeType: 'image/webp'
      })
    } catch (error) {
      console.error('Error processing image:', error)
      return res.status(500).json({
        success: false,
        error: 'Error processing image'
      })
    }
  }

  res.json({
    success: true,
    message: \`\${uploadedFiles.length} files uploaded successfully\`,
    data: { files: uploadedFiles }
  })
}))

// Delete image
router.delete('/images/:fileId', authenticateToken, asyncHandler(async (req, res) => {
  const { fileId } = req.params

  try {
    const fileName = \`\${fileId}.webp\`
    const thumbnailName = \`\${fileId}_thumb.webp\`
    
    const filePath = path.join(uploadDir, fileName)
    const thumbnailPath = path.join(uploadDir, thumbnailName)

    // Delete files if they exist
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath)
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({
      success: false,
      error: 'Error deleting file'
    })
  }
}))

// Get image info
router.get('/images/:fileId', asyncHandler(async (req, res) => {
  const { fileId } = req.params
  const fileName = \`\${fileId}.webp\`
  const filePath = path.join(uploadDir, fileName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found'
    })
  }

  const stats = fs.statSync(filePath)

  res.json({
    success: true,
    data: {
      id: fileId,
      fileName,
      url: \`/uploads/images/\${fileName}\`,
      thumbnailUrl: \`/uploads/images/\${fileId}_thumb.webp\`,
      size: stats.size,
      createdAt: stats.birthtime,
      mimeType: 'image/webp'
    }
  })
}))

module.exports = router`,

  'apps/api/src/routes/payments.js': `const express = require('express')
const { body, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Mock payment processing - replace with actual payment provider
const processPayment = async (amount, paymentMethodId) => {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: \`payment_\${Date.now()}\`,
        status: 'succeeded',
        amount,
        currency: 'krw'
      })
    }, 1000)
  })
}

// Create payment intent
router.post('/create-intent', [
  body('auctionId').isUUID(),
  body('amount').isFloat({ min: 0 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { auctionId, amount } = req.body

  // Verify auction and user is winner
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      product: true,
      bids: {
        where: { isWinning: true },
        include: { bidder: true }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  if (auction.status !== 'ENDED') {
    return res.status(400).json({
      success: false,
      error: 'Auction has not ended'
    })
  }

  const winningBid = auction.bids[0]
  if (!winningBid || winningBid.bidderId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'You are not the winner of this auction'
    })
  }

  if (parseFloat(amount) !== winningBid.amount) {
    return res.status(400).json({
      success: false,
      error: 'Payment amount does not match winning bid'
    })
  }

  // Create payment intent (mock)
  const paymentIntent = {
    id: \`pi_\${Date.now()}\`,
    amount: parseFloat(amount),
    currency: 'krw',
    status: 'requires_payment_method',
    clientSecret: \`pi_\${Date.now()}_secret_\${Math.random().toString(36).substr(2, 9)}\`
  }

  res.json({
    success: true,
    data: { paymentIntent }
  })
}))

// Confirm payment
router.post('/confirm', [
  body('paymentIntentId').notEmpty(),
  body('paymentMethodId').notEmpty(),
  body('auctionId').isUUID()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { paymentIntentId, paymentMethodId, auctionId } = req.body

  // Get auction details
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      product: {
        include: { seller: true }
      },
      bids: {
        where: { isWinning: true }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  const winningBid = auction.bids[0]
  
  try {
    // Process payment (mock)
    const payment = await processPayment(winningBid.amount, paymentMethodId)

    if (payment.status === 'succeeded') {
      // Create payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          id: payment.id,
          auctionId,
          buyerId: req.user.id,
          sellerId: auction.product.sellerId,
          amount: payment.amount,
          currency: payment.currency,
          status: 'COMPLETED',
          paymentMethod: 'card',
          paymentIntentId
        }
      })

      // Update product status
      await prisma.product.update({
        where: { id: auction.productId },
        data: { status: 'SOLD' }
      })

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment: paymentRecord,
          auction
        }
      })
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed'
      })
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    })
  }
}))

// Get payment history
router.get('/history', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type = 'all' // 'purchases', 'sales', 'all'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  let where = {}
  if (type === 'purchases') {
    where.buyerId = req.user.id
  } else if (type === 'sales') {
    where.sellerId = req.user.id
  } else {
    where.OR = [
      { buyerId: req.user.id },
      { sellerId: req.user.id }
    ]
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        auction: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    }),
    prisma.payment.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

module.exports = router`,

  'apps/api/src/routes/users.js': `const express = require('express')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      address: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          products: true,
          auctions: true,
          bids: true
        }
      }
    }
  })

  res.json({
    success: true,
    data: { user }
  })
}))

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().isMobilePhone('ko-KR'),
  body('address').optional().trim().isLength({ max: 200 }),
  body('avatar').optional().isURL()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const updateData = {}
  const { name, phone, address, avatar } = req.body

  if (name) updateData.name = name
  if (phone) updateData.phone = phone
  if (address) updateData.address = address
  if (avatar) updateData.avatar = avatar

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      address: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      updatedAt: true
    }
  })

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  })
}))

// Change password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password)
  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    })
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12)

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword }
  })

  res.json({
    success: true,
    message: 'Password changed successfully'
  })
}))

// Get user's bids
router.get('/bids', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status = 'all' // 'winning', 'outbid', 'won', 'lost', 'all'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  let where = {
    bidderId: req.user.id
  }

  // Add status filter
  if (status === 'winning') {
    where.isWinning = true
    where.auction = { status: 'ACTIVE' }
  } else if (status === 'outbid') {
    where.isWinning = false
    where.auction = { status: 'ACTIVE' }
  } else if (status === 'won') {
    where.isWinning = true
    where.auction = { status: 'ENDED' }
  } else if (status === 'lost') {
    where.isWinning = false
    where.auction = { status: 'ENDED' }
  }

  const [bids, total] = await Promise.all([
    prisma.bid.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        auction: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            }
          }
        }
      }
    }),
    prisma.bid.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      bids,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

// Get user's notifications
router.get('/notifications', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = {
    userId: req.user.id
  }

  if (unreadOnly === 'true') {
    where.isRead = false
  }

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: req.user.id
    }
  })

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    })
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  })

  res.json({
    success: true,
    message: 'Notification marked as read'
  })
}))

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false
    },
    data: { isRead: true }
  })

  res.json({
    success: true,
    message: 'All notifications marked as read'
  })
}))

module.exports = router`,

  // ==================== SERVICES ====================
  
  'apps/api/src/services/websocket.js': `const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const setupWebSocket = (io) => {
  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      })

      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(\`User \${socket.user.name} connected\`)

    // Join auction room
    socket.on('join-auction', async (data) => {
      const { auctionId } = data
      
      try {
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            product: {
              select: {
                title: true,
                sellerId: true
              }
            }
          }
        })

        if (auction) {
          socket.join(\`auction-\${auctionId}\`)
          socket.currentAuction = auctionId
          
          // Notify others that user joined
          socket.to(\`auction-\${auctionId}\`).emit('user-joined', {
            user: socket.user,
            timestamp: new Date()
          })

          console.log(\`User \${socket.user.name} joined auction \${auctionId}\`)
        }
      } catch (error) {
        console.error('Error joining auction:', error)
        socket.emit('error', { message: 'Failed to join auction' })
      }
    })

    // Leave auction room
    socket.on('leave-auction', (data) => {
      const { auctionId } = data
      
      if (socket.currentAuction === auctionId) {
        socket.leave(\`auction-\${auctionId}\`)
        socket.to(\`auction-\${auctionId}\`).emit('user-left', {
          user: socket.user,
          timestamp: new Date()
        })
        socket.currentAuction = null
        console.log(\`User \${socket.user.name} left auction \${auctionId}\`)
      }
    })

    // Place bid
    socket.on('place-bid', async (data) => {
      const { auctionId, amount } = data

      try {
        // Validate bid (simplified - should use the same logic as API route)
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            product: true,
            bids: {
              orderBy: { amount: 'desc' },
              take: 1
            }
          }
        })

        if (!auction || auction.status !== 'ACTIVE') {
          socket.emit('bid-error', { message: 'Auction is not active' })
          return
        }

        if (auction.product.sellerId === socket.userId) {
          socket.emit('bid-error', { message: 'Cannot bid on your own auction' })
          return
        }

        const minBidAmount = auction.currentPrice + 1000
        if (amount < minBidAmount) {
          socket.emit('bid-error', { 
            message: \`Bid must be at least \${minBidAmount.toLocaleString()}원\` 
          })
          return
        }

        // Create bid (simplified transaction)
        await prisma.bid.updateMany({
          where: {
            auctionId,
            isWinning: true
          },
          data: { isWinning: false }
        })

        const bid = await prisma.bid.create({
          data: {
            auctionId,
            bidderId: socket.userId,
            amount: parseFloat(amount),
            isWinning: true
          },
          include: {
            bidder: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        })

        await prisma.auction.update({
          where: { id: auctionId },
          data: {
            currentPrice: parseFloat(amount),
            bidCount: { increment: 1 }
          }
        })

        // Broadcast new bid to all users in auction room
        io.to(\`auction-\${auctionId}\`).emit('new-bid', {
          bid,
          auction: {
            id: auctionId,
            currentPrice: parseFloat(amount),
            bidCount: auction.bidCount + 1
          },
          timestamp: new Date()
        })

        console.log(\`New bid placed: \${amount} by \${socket.user.name} on auction \${auctionId}\`)

      } catch (error) {
        console.error('Error placing bid:', error)
        socket.emit('bid-error', { message: 'Failed to place bid' })
      }
    })

    // Send message in auction chat
    socket.on('send-message', async (data) => {
      const { auctionId, message } = data

      try {
        if (socket.currentAuction !== auctionId) {
          socket.emit('error', { message: 'Not in auction room' })
          return
        }

        // Create message record
        const messageRecord = await prisma.message.create({
          data: {
            content: message,
            senderId: socket.userId,
            receiverId: 'auction', // Special receiver for auction messages
            type: 'TEXT'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        })

        // Broadcast message to auction room
        io.to(\`auction-\${auctionId}\`).emit('new-message', {
          message: messageRecord,
          timestamp: new Date()
        })

      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.currentAuction) {
        socket.to(\`auction-\${socket.currentAuction}\`).emit('user-left', {
          user: socket.user,
          timestamp: new Date()
        })
      }
      console.log(\`User \${socket.user.name} disconnected\`)
    })
  })

  // Auction end notification (called from auction service)
  const notifyAuctionEnd = (auctionId, auctionData) => {
    io.to(\`auction-\${auctionId}\`).emit('auction-ended', {
      auction: auctionData,
      timestamp: new Date()
    })
  }

  // Bid notification (called from bid service)
  const notifyOutbid = (userId, auctionData) => {
    io.emit('outbid-notification', {
      userId,
      auction: auctionData,
      timestamp: new Date()
    })
  }

  return {
    notifyAuctionEnd,
    notifyOutbid
  }
}

module.exports = { setupWebSocket }`,

  'apps/api/src/services/email.js': `const nodemailer = require('nodemailer')

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Email templates
const templates = {
  verification: (data) => ({
    subject: 'MarketAI 이메일 인증',
    html: \`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>안녕하세요, \${data.name}님!</h2>
          <p>MarketAI에 가입해 주셔서 감사합니다.</p>
          <p>아래 버튼을 클릭하여 이메일 인증을 완료해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${data.verificationUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              이메일 인증하기
            </a>
          </div>
          <p>링크가 작동하지 않는다면 아래 URL을 복사하여 브라우저에 붙여넣어 주세요:</p>
          <p style="word-break: break-all; color: #666;">\${data.verificationUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            이 이메일은 MarketAI에서 자동으로 발송되었습니다.<br>
            문의사항이 있으시면 support@marketai.com으로 연락해 주세요.
          </p>
        </div>
      </div>
    \`
  }),

  'password-reset': (data) => ({
    subject: 'MarketAI 비밀번호 재설정',
    html: \`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>안녕하세요, \${data.name}님!</h2>
          <p>비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${data.resetUrl}" 
               style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              비밀번호 재설정
            </a>
          </div>
          <p>이 링크는 1시간 후에 만료됩니다.</p>
          <p>비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시해 주세요.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            이 이메일은 MarketAI에서 자동으로 발송되었습니다.<br>
            문의사항이 있으시면 support@marketai.com으로 연락해 주세요.
          </p>
        </div>
      </div>
    \`
  }),

  'bid-notification': (data) => ({
    subject: \`[\${data.productTitle}] 새로운 입찰이 있습니다\`,
    html: \`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>새로운 입찰 알림</h2>
          <p>안녕하세요, \${data.userName}님!</p>
          <p>회원님의 상품 <strong>\${data.productTitle}</strong>에 새로운 입찰이 있습니다.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>현재 최고가:</strong> \${data.currentPrice.toLocaleString()}원</p>
            <p><strong>입찰자:</strong> \${data.bidderName}</p>
            <p><strong>입찰 시간:</strong> \${data.bidTime}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${data.auctionUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              경매 확인하기
            </a>
          </div>
        </div>
      </div>
    \`
  }),

  'auction-end': (data) => ({
    subject: \`[\${data.productTitle}] 경매가 종료되었습니다\`,
    html: \`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>경매 종료 알림</h2>
          <p>안녕하세요, \${data.userName}님!</p>
          <p><strong>\${data.productTitle}</strong> 경매가 종료되었습니다.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>최종 낙찰가:</strong> \${data.finalPrice.toLocaleString()}원</p>
            \${data.isWinner ? 
              \`<p style="color: #10b981;"><strong>축하합니다! 회원님이 낙찰받으셨습니다.</strong></p>\` :
              \`<p style="color: #ef4444;"><strong>아쉽게도 다른 분이 낙찰받으셨습니다.</strong></p>\`
            }
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${data.auctionUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              경매 결과 확인
            </a>
          </div>
        </div>
      </div>
    \`
  })
}

// Send email function
const sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    const transporter = createTransporter()

    let emailContent
    if (template && templates[template]) {
      emailContent = templates[template](data)
    } else if (html) {
      emailContent = { subject, html }
    } else {
      throw new Error('No template or HTML content provided')
    }

    const mailOptions = {
      from: \`"\${process.env.FROM_NAME || 'MarketAI'}" <\${process.env.FROM_EMAIL || process.env.SMTP_USER}>\`,
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Bulk email function
const sendBulkEmail = async (emails) => {
  const results = []
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email)
      results.push({ success: true, messageId: result.messageId, to: email.to })
    } catch (error) {
      results.push({ success: false, error: error.message, to: email.to })
    }
  }
  
  return results
}

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
}`
};

// 파일 생성 함수
function writeAdditionalFiles() {
  let successCount = 0;
  let errorCount = 0;

  console.log('🚀 추가 파일 생성을 시작합니다...\n');

  Object.entries(additionalFiles).forEach(([filePath, content]) => {
    try {
      const fullPath = path.join(__dirname, filePath);
      const dir = path.dirname(fullPath);
      
      // 디렉토리 확인 및 생성
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
      
      // 파일 내용 작성
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Written: ${filePath}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error writing ${filePath}:`, error.message);
      errorCount++;
    }
  });

  console.log(`\n📊 추가 파일 생성 완료:`);
  console.log(`✅ 성공적으로 생성된 파일: ${successCount}개`);
  console.log(`❌ 오류 발생한 파일: ${errorCount}개`);

  if (errorCount === 0) {
    console.log(`\n🎉 모든 추가 파일이 성공적으로 생성되었습니다!`);
    console.log(`\n📋 다음 단계:`);
    console.log(`1. cd apps/api && npm install`);
    console.log(`2. cd apps/web && npm install`);
    console.log(`3. npx prisma generate (API 폴더에서)`);
    console.log(`4. npx prisma db push (API 폴더에서)`);
    console.log(`5. npx prisma db seed (API 폴더에서)`);
    console.log(`6. npm run dev (루트 폴더에서)`);
  }
}

// 실행
writeAdditionalFiles();
