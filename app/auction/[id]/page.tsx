import { notFound } from "next/navigation"
import AuctionDetailPageClient from "./AuctionDetailPageClient"

interface AuctionPageProps {
  params: {
    id: string
  }
}

// 정적 생성을 위한 경매 ID 목록
export async function generateStaticParams() {
  // 실제로는 데이터베이스에서 경매 ID 목록을 가져와야 합니다
  const auctionIds = Array.from({ length: 100 }, (_, i) => ({ id: `auction_${i + 1}` }))

  return auctionIds
}

export default function AuctionPage({ params }: AuctionPageProps) {
  if (!params.id) {
    notFound()
  }

  return <AuctionDetailPageClient auctionId={params.id} />
}
