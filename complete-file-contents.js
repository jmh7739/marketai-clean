const fs = require('fs');
const path = require('path');

// 전체 파일 내용 정의
const fileContents = {
  // ==================== ROOT CONFIG FILES ====================
  
  '.env.example': `# MarketAI Environment Variables Template
# Copy this file to .env and fill in your actual values

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/marketai
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# File Upload
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# External APIs
OPENAI_API_KEY=sk-your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App URLs
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001`,

  'package.json': `{
  "name": "marketai",
  "version": "1.0.0",
  "description": "Smart Auction Marketplace",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean",
    "type-check": "turbo run type-check",
    "format": "prettier --write \\"**/*.{js,jsx,ts,tsx,json,md}\\"",
    "db:generate": "cd apps/api && npx prisma generate",
    "db:push": "cd apps/api && npx prisma db push",
    "db:migrate": "cd apps/api && npx prisma migrate dev",
    "db:seed": "cd apps/api && npx prisma db seed",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  },
  "devDependencies": {
    "@turbo/gen": "^1.10.12",
    "eslint": "^8.48.0",
    "prettier": "^3.0.0",
    "turbo": "latest",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "packageManager": "npm@8.19.2"
}`,

  'turbo.json': `{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "clean": {
      "cache": false
    }
  }
}`,

  '.prettierrc': `{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}`,

  '.gitignore': `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.db
*.sqlite

# Turbo
.turbo

# Vercel
.vercel

# Docker
.dockerignore

# Supabase
supabase/.branches
supabase/.temp`,

  'README.md': `# MarketAI - Smart Auction Marketplace

스마트 경매 마켓플레이스 플랫폼입니다.

## 🚀 Features

- **실시간 경매**: WebSocket을 통한 실시간 입찰
- **AI 추천**: 개인화된 상품 추천 시스템
- **모바일 앱**: React Native 크로스 플랫폼 앱
- **관리자 대시보드**: 통합 관리 시스템
- **결제 시스템**: Stripe 통합 결제
- **이미지 업로드**: Supabase Storage 연동

## 🏗️ Architecture

\`\`\`
MarketAI/
├── apps/
│   ├── web/          # Next.js 웹 애플리케이션
│   ├── api/          # Node.js API 서버
│   ├── mobile/       # React Native 모바일 앱
│   └── admin/        # 관리자 대시보드
├── packages/
│   ├── ui/           # 공유 UI 컴포넌트
│   ├── core/         # 공통 로직
│   └── config/       # 설정 파일들
└── infrastructure/   # Docker, K8s 설정
\`\`\`

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - UI 컴포넌트

### Backend
- **Node.js** - 런타임
- **Express** - 웹 프레임워크
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스
- **Redis** - 캐싱

### Mobile
- **React Native** - 크로스 플랫폼
- **Expo** - 개발 도구

### Infrastructure
- **Docker** - 컨테이너화
- **Kubernetes** - 오케스트레이션
- **Vercel** - 배포 (웹)
- **Supabase** - BaaS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Docker (선택사항)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/your-username/marketai.git
cd marketai
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
# Edit .env with your actual values
\`\`\`

4. **Set up database**
\`\`\`bash
npm run db:generate
npm run db:push
npm run db:seed
\`\`\`

5. **Start development servers**
\`\`\`bash
npm run dev
\`\`\`

### URLs
- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3002

## 📱 Mobile Development

\`\`\`bash
cd apps/mobile
npm install
npx expo start
\`\`\`

## 🐳 Docker Development

\`\`\`bash
npm run docker:build
npm run docker:up
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm run test

# Run specific app tests
cd apps/web && npm test
cd apps/api && npm test
\`\`\`

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Development Setup](./docs/development/setup.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: Next.js, React Native
- **Backend**: Node.js, PostgreSQL
- **DevOps**: Docker, Kubernetes
- **Design**: Figma, Tailwind CSS

## 📞 Support

For support, email support@marketai.com or join our Slack channel.`,

  // ==================== WEB APP FILES ====================
  
  'apps/web/package.json': `{
  "name": "@marketai/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@next/font": "14.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "axios": "^1.5.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "lucide-react": "^0.290.0",
    "socket.io-client": "^4.7.2",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.1",
    "react-query": "^3.39.3",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.1",
    "framer-motion": "^10.16.4",
    "swiper": "^10.3.1",
    "react-intersection-observer": "^9.5.2"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.48.0",
    "eslint-config-next": "14.0.0"
  }
}`,

  'apps/web/.env.local': `# MarketAI Web App Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true`,

  'apps/web/next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'your-supabase-project.supabase.co',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig`,

  'apps/web/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}`,

  'apps/web/app/globals.css': `:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 94.1%;
}

* {
  border-color: hsl(var(--border));
}

body {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}`,

  'apps/web/app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MarketAI - 스마트 경매 마켓플레이스',
  description: 'AI 기반 스마트 경매 플랫폼에서 다양한 상품을 경매로 거래하세요',
  keywords: '경매, 마켓플레이스, AI, 온라인쇼핑, 중고거래',
  authors: [{ name: 'MarketAI Team' }],
  openGraph: {
    title: 'MarketAI - 스마트 경매 마켓플레이스',
    description: 'AI 기반 스마트 경매 플랫폼',
    url: 'https://marketai.com',
    siteName: 'MarketAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MarketAI',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketAI - 스마트 경매 마켓플레이스',
    description: 'AI 기반 스마트 경매 플랫폼',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}`,

  'apps/web/app/page.tsx': `import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { FeaturedAuctions } from '../components/FeaturedAuctions'
import { Categories } from '../components/Categories'
import { HowItWorks } from '../components/HowItWorks'
import { Footer } from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedAuctions />
        <Categories />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}`,

  'apps/web/components/Hero.tsx': `'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, Award } from 'lucide-react'
import { Button } from '../../../packages/ui/src/components/Button'

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAuctions: 0,
    totalSales: 0
  })

  useEffect(() => {
    // 애니메이션 효과를 위한 카운터
    const animateStats = () => {
      const targetStats = {
        totalUsers: 15420,
        activeAuctions: 1250,
        totalSales: 2840000000
      }

      let current = { totalUsers: 0, activeAuctions: 0, totalSales: 0 }
      const duration = 2000 // 2초
      const steps = 60
      const increment = {
        totalUsers: targetStats.totalUsers / steps,
        activeAuctions: targetStats.activeAuctions / steps,
        totalSales: targetStats.totalSales / steps
      }

      const timer = setInterval(() => {
        current.totalUsers = Math.min(current.totalUsers + increment.totalUsers, targetStats.totalUsers)
        current.activeAuctions = Math.min(current.activeAuctions + increment.activeAuctions, targetStats.activeAuctions)
        current.totalSales = Math.min(current.totalSales + increment.totalSales, targetStats.totalSales)

        setStats({
          totalUsers: Math.floor(current.totalUsers),
          activeAuctions: Math.floor(current.activeAuctions),
          totalSales: Math.floor(current.totalSales)
        })

        if (current.totalUsers >= targetStats.totalUsers) {
          clearInterval(timer)
        }
      }, duration / steps)
    }

    animateStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = \`/search?q=\${encodeURIComponent(searchQuery)}\`
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + '억'
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '만'
    }
    return num.toLocaleString()
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-300 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-primary-600 rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">스마트한 경매,</span>
            <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              새로운 거래 경험
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI 기반 추천 시스템과 실시간 경매로 
            <br className="hidden sm:block" />
            원하는 상품을 더 스마트하게 거래하세요
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="어떤 상품을 찾고 계신가요? (예: 아이폰, 맥북, 나이키)"
                  className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 shadow-lg"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-3 rounded-xl"
              >
                검색
              </Button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auctions">
              <Button size="lg" className="px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                🔥 진행중인 경매 보기
              </Button>
            </Link>
            <Link href="/sell">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-primary-50 transition-all duration-200"
              >
                💰 상품 판매하기
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-primary-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalUsers)}+
                </span>
              </div>
              <p className="text-gray-600 font-medium">활성 사용자</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 text-primary-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.activeAuctions)}+
                </span>
              </div>
              <p className="text-gray-600 font-medium">진행중인 경매</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-primary-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalSales)}원
                </span>
              </div>
              <p className="text-gray-600 font-medium">총 거래액</p>
            </div>
          </div>

          {/* Popular Keywords */}
          <div className="mt-12">
            <p className="text-gray-500 mb-4">인기 검색어</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['아이폰 15', '맥북 프로', '에어팟', '갤럭시', '나이키', '아디다스', '루이비통', '샤넬'].map((keyword) => (
                <Link
                  key={keyword}
                  href={\`/search?q=\${encodeURIComponent(keyword)}\`}
                  className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm text-gray-700 hover:text-primary-600 transition-all duration-200 border border-gray-200 hover:border-primary-300"
                >
                  #{keyword}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}`,

  'apps/web/components/Footer.tsx': `import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MarketAI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI 기반 스마트 경매 마켓플레이스로 
              더 나은 거래 경험을 제공합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auctions" className="text-gray-400 hover:text-white transition-colors text-sm">
                  진행중인 경매
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                  상품 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors text-sm">
                  카테고리
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-white transition-colors text-sm">
                  판매하기
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
                  이용방법
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-white transition-colors text-sm">
                  안전거래 가이드
                </Link>
              </li>
              <li>
                <Link href="/dispute" className="text-gray-400 hover:text-white transition-colors text-sm">
                  분쟁해결
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">1588-1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">support@marketai.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  서울시 강남구 테헤란로 123<br />
                  MarketAI 빌딩 10층
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs">
                고객센터 운영시간<br />
                평일 09:00 - 18:00<br />
                (주말 및 공휴일 휴무)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors font-semibold">
                개인정보처리방침
              </Link>
              <Link href="/youth" className="hover:text-white transition-colors">
                청소년보호정책
              </Link>
              <Link href="/business" className="hover:text-white transition-colors">
                사업자정보
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 MarketAI. All rights reserved.
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500">
            <p className="mb-2">
              <strong>㈜마켓에이아이</strong> | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 2024-서울강남-1234
            </p>
            <p className="mb-2">
              주소: 서울시 강남구 테헤란로 123, MarketAI 빌딩 10층 | 개인정보보호책임자: 김개인 (privacy@marketai.com)
            </p>
            <p>
              MarketAI는 통신판매중개자로서 통신판매의 당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대해 책임을 지지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}`,

  // ==================== API FILES ====================
  
  'apps/api/package.json': `{
  "name": "@marketai/api",
  "version": "1.0.0",
  "description": "MarketAI API Server",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "build": "echo 'No build step required'",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.js",
    "clean": "rm -rf node_modules/.cache"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.10.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "nodemailer": "^6.9.7",
    "socket.io": "^4.7.2",
    "redis": "^4.6.8",
    "stripe": "^13.8.0",
    "@prisma/client": "^5.4.2",
    "@supabase/supabase-js": "^2.38.0",
    "axios": "^1.5.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.1",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.48.0",
    "prisma": "^5.4.2"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}`,

  'apps/api/src/server.js': `const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const productRoutes = require('./routes/products')
const auctionRoutes = require('./routes/auctions')
const categoryRoutes = require('./routes/categories')
const uploadRoutes = require('./routes/upload')
const paymentRoutes = require('./routes/payments')

const { errorHandler } = require('./middleware/errorHandler')
const { setupWebSocket } = require('./services/websocket')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.WS_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(limiter)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://marketai.com', 'https://www.marketai.com']
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/auctions', auctionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payments', paymentRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  })
})

// Error handling middleware
app.use(errorHandler)

// Setup WebSocket
setupWebSocket(io)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

// Start server
server.listen(PORT, () => {
  console.log(\`🚀 MarketAI API Server running on port \${PORT}\`)
  console.log(\`📊 Environment: \${process.env.NODE_ENV}\`)
  console.log(\`🔗 Health check: http://localhost:\${PORT}/health\`)
})

module.exports = { app, server, io }`,

  // ==================== DOCUMENTATION ====================
  
  'docs/api/README.md': `# MarketAI API Documentation

## 개요
MarketAI 스마트 경매 마켓플레이스의 RESTful API 문서입니다.

## Base URL
- **Development**: \`http://localhost:3001\`
- **Production**: \`https://api.marketai.com\`

## 인증
대부분의 API 엔드포인트는 JWT 토큰을 통한 인증이 필요합니다.

### 헤더 형식
\`\`\`http
Authorization: Bearer <your_access_token>
Content-Type: application/json
\`\`\`

## 응답 형식
모든 API 응답은 다음 형식을 따릅니다:

### 성공 응답
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
\`\`\`

### 오류 응답
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": []
}
\`\`\`

## 엔드포인트

### 🔐 인증 (Authentication)

#### 회원가입
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
\`\`\`

#### 로그인
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### 📦 상품 (Products)

#### 상품 목록 조회
\`\`\`http
GET /api/products?page=1&limit=20&category=cat1&search=iPhone
\`\`\`

#### 상품 등록
\`\`\`http
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
\`\`\`

### 🔨 경매 (Auctions)

#### 경매 목록 조회
\`\`\`http
GET /api/auctions?status=active&page=1&limit=20
\`\`\`

#### 입찰하기
\`\`\`http
POST /api/auctions/:id/bid
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1100000
}
\`\`\`

## 웹소켓 이벤트

실시간 ��매를 위한 웹소켓 연결:

\`\`\`javascript
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
\`\`\`

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| \`AUTH_REQUIRED\` | 401 | 인증이 필요합니다 |
| \`INVALID_TOKEN\` | 403 | 유효하지 않은 토큰입니다 |
| \`PRODUCT_NOT_FOUND\` | 404 | 상품을 찾을 수 없습니다 |
| \`AUCTION_ENDED\` | 400 | 경매가 종료되었습니다 |
| \`BID_TOO_LOW\` | 400 | 입찰가가 너무 낮습니다 |

더 자세한 API 문서는 [Postman Collection](./postman-collection.json)을 참고하세요.`,

  'docs/deployment/README.md': `# MarketAI 배포 가이드

## 개요
MarketAI 애플리케이션을 프로덕션 환경에 배포하는 방법을 설명합니다.

## 배포 옵션

### 1. Vercel 배포 (권장)

#### 웹 애플리케이션 배포
\`\`\`bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 배포
cd apps/web
vercel --prod
\`\`\`

#### API 서버 배포
\`\`\`bash
cd apps/api
vercel --prod
\`\`\`

### 2. Docker 배포

#### Docker Compose 사용
\`\`\`bash
# 프로덕션 환경 구성
cp .env.example .env
# .env 파일 수정

# 컨테이너 빌드 및 실행
docker-compose -f infrastructure/docker/docker-compose.yml up -d
\`\`\`

### 3. 클라우드 배포

#### AWS ECS
\`\`\`bash
# ECR에 이미지 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

docker build -t marketai-web apps/web/
docker tag marketai-web:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/marketai-web:latest
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/marketai-web:latest
\`\`\`

## 환경 변수 설정

### 필수 환경 변수
\`\`\`bash
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:5432/marketai
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-super-secret-key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-key
\`\`\`

## 데이터베이스 마이그레이션

\`\`\`bash
# Prisma 마이그레이션 실행
cd apps/api
npx prisma migrate deploy
npx prisma db seed
\`\`\`

## 모니터링 설정

### 로그 수집
- CloudWatch (AWS)
- Vercel Analytics
- Sentry 에러 추적

### 성능 모니터링
- New Relic
- DataDog
- Vercel Speed Insights

## SSL 인증서

### Let's Encrypt 사용
\`\`\`bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d marketai.com -d www.marketai.com
\`\`\`

## 백업 전략

### 데이터베이스 백업
\`\`\`bash
# 자동 백업 스크립트
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://marketai-backups/
\`\`\`

### 파일 백업
- Supabase Storage 자동 백업
- S3 Cross-Region Replication

## 보안 체크리스트

- [ ] HTTPS 강제 적용
- [ ] 환경 변수 암호화
- [ ] API Rate Limiting 설정
- [ ] CORS 정책 설정
- [ ] SQL Injection 방지
- [ ] XSS 방지 헤더 설정
- [ ] 정기 보안 업데이트

## 성능 최적화

### CDN 설정
- Vercel Edge Network
- CloudFlare
- AWS CloudFront

### 캐싱 전략
- Redis 캐싱
- Next.js ISR
- API 응답 캐싱

## 롤백 전략

### 무중단 배포
\`\`\`bash
# Blue-Green 배포
# 1. 새 버전 배포
# 2. 헬스체크 확인
# 3. 트래픽 전환
# 4. 이전 버전 종료
\`\`\`

### 데이터베이스 롤백
\`\`\`bash
# 마이그레이션 롤백
npx prisma migrate reset
# 백업에서 복원
psql $DATABASE_URL < backup_20241201_120000.sql
\`\`\`

## 문제 해결

### 일반적인 문제들

1. **메모리 부족**
   - Node.js 힙 크기 증가: \`--max-old-space-size=4096\`

2. **데이터베이스 연결 오류**
   - 연결 풀 설정 확인
   - 네트워크 보안 그룹 확인

3. **빌드 실패**
   - 의존성 버전 확인
   - 환경 변수 설정 확인

### 로그 확인
\`\`\`bash
# Docker 로그
docker logs marketai-api

# PM2 로그
pm2 logs marketai

# Vercel 로그
vercel logs
\`\`\`

## 지원

배포 관련 문제가 있으면 다음으로 연락하세요:
- 이메일: devops@marketai.com
- Slack: #deployment-support`,

  'tests/unit/api.test.js': `const request = require('supertest')
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
})`,

  'LICENSE': `MIT License

Copyright (c) 2024 MarketAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  // ==================== MOBILE APP FILES ====================
  
  'apps/mobile/package.json': `{
  "name": "@marketai/mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "build:android": "expo build:android",
    "build:ios": "expo build:ios",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-router": "^2.0.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0",
    "expo-status-bar": "~1.6.0",
    "expo-font": "~11.4.0",
    "expo-linking": "~5.0.0",
    "expo-constants": "~14.4.2",
    "expo-splash-screen": "~0.20.0",
    "@expo/vector-icons": "^13.0.0",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-reanimated": "~3.3.0",
    "axios": "^1.5.0",
    "react-query": "^3.39.3",
    "socket.io-client": "^4.7.2",
    "react-hook-form": "^7.47.0",
    "react-native-image-picker": "^5.6.0",
    "react-native-async-storage": "^1.19.3"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3",
    "eslint": "^8.48.0"
  },
  "private": true
}`,

  'apps/mobile/app.json': `{
  "expo": {
    "name": "MarketAI",
    "slug": "marketai-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.marketai.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "package": "com.marketai.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "marketai"
  }
}`,

  'apps/mobile/app/_layout.tsx': `import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}`,

  'apps/mobile/app/(tabs)/_layout.tsx': `import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="auctions"
        options={{
          title: '경매',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'hammer' : 'hammer-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  )
}`,

  'apps/mobile/app/(tabs)/index.tsx': `import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const featuredAuctions = [
    {
      id: '1',
      title: 'iPhone 15 Pro 256GB',
      currentPrice: 1150000,
      timeLeft: '2시간 23분',
      image: 'https://via.placeholder.com/200x200'
    },
    {
      id: '2',
      title: 'MacBook Pro M3',
      currentPrice: 2500000,
      timeLeft: '1일 5시간',
      image: 'https://via.placeholder.com/200x200'
    }
  ]

  const categories = [
    { id: '1', name: '전자제품', icon: '📱' },
    { id: '2', name: '패션', icon: '👕' },
    { id: '3', name: '홈&리빙', icon: '🏠' },
    { id: '4', name: '스포츠', icon: '⚽' }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MarketAI</Text>
          <Text style={styles.headerSubtitle}>스마트 경매 마켓플레이스</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Auctions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인기 경매</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredAuctions.map((auction) => (
              <TouchableOpacity key={auction.id} style={styles.auctionCard}>
                <Image source={{ uri: auction.image }} style={styles.auctionImage} />
                <View style={styles.auctionInfo}>
                  <Text style={styles.auctionTitle}>{auction.title}</Text>
                  <Text style={styles.auctionPrice}>
                    {auction.currentPrice.toLocaleString()}원
                  </Text>
                  <Text style={styles.auctionTime}>⏰ {auction.timeLeft}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>빠른 메뉴</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🔥</Text>
              <Text style={styles.quickActionText}>진행중인 경매</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>판매하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionText}>관심목록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>내 입찰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  auctionCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  auctionImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  auctionInfo: {
    padding: 12,
  },
  auctionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  auctionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  auctionTime: {
    fontSize: 12,
    color: '#ef4444',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
})`,

  // ==================== INFRASTRUCTURE FILES ====================
  
  'infrastructure/docker/docker-compose.yml': `version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: marketai-postgres
    environment:
      POSTGRES_DB: marketai
      POSTGRES_USER: marketai
      POSTGRES_PASSWORD: marketai123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - marketai-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: marketai-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - marketai-network

  # API Server
  api:
    build:
      context: ../../apps/api
      dockerfile: Dockerfile
    container_name: marketai-api
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://marketai:marketai123@postgres:5432/marketai
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your_jwt_secret_here
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    volumes:
      - ../../apps/api:/app
      - /app/node_modules
    networks:
      - marketai-network

  # Web App
  web:
    build:
      context: ../../apps/web
      dockerfile: Dockerfile
    container_name: marketai-web
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - api
    volumes:
      - ../../apps/web:/app
      - /app/node_modules
      - /app/.next
    networks:
      - marketai-network

volumes:
  postgres_data:
  redis_data:

networks:
  marketai-network:
    driver: bridge`,

  'Dockerfile': `# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 marketai

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER marketai

EXPOSE 3000
EXPOSE 3001

ENV PORT 3000

CMD ["npm", "start"]`
};

// 파일 생성 함수
function writeAllFiles() {
  let successCount = 0;
  let errorCount = 0;

  console.log('🚀 MarketAI 프로젝트 파일 생성을 시작합니다...\n');

  Object.entries(fileContents).forEach(([filePath, content]) => {
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

  console.log(`\n📊 생성 완료 요약:`);
  console.log(`✅ 성공적으로 생성된 파일: ${successCount}개`);
  console.log(`❌ 오류 발생한 파일: ${errorCount}개`);

  if (errorCount === 0) {
    console.log(`\n🎉 모든 파일이 성공적으로 생성되었습니다!`);
    console.log(`\n📋 다음 단계:`);
    console.log(`1. npm install - 의존성 설치`);
    console.log(`2. .env 파일 설정`);
    console.log(`3. 데이터베이스 설정`);
    console.log(`4. npm run dev - 개발 서버 시작`);
    console.log(`\n🔗 유용한 링크:`);
    console.log(`- 웹 앱: http://localhost:3000`);
    console.log(`- API 서버: http://localhost:3001`);
    console.log(`- API 문서: ./docs/api/README.md`);
  }
}

// 실행
writeAllFiles();