#!/bin/bash

echo "📦 모든 Radix UI 패키지 설치 중..."

# 필수 Radix UI 패키지들
npm install @radix-ui/react-slot@^1.0.2
npm install @radix-ui/react-checkbox@^1.0.4
npm install @radix-ui/react-label@^2.0.2
npm install @radix-ui/react-select@^2.0.0

# 유틸리티 패키지들
npm install class-variance-authority@^0.7.0
npm install clsx@^2.1.0
npm install tailwind-merge@^2.2.0

# 아이콘 패키지
npm install lucide-react@^0.294.0

# Tailwind 애니메이션
npm install tailwindcss-animate@^1.0.7

echo "✅ 모든 패키지 설치 완료!"
