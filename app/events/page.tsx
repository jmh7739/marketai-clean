"use client"

import { useState } from "react"
import { Gift, Calendar, Clock, Users, Star, Trophy, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: number
  title: string
  description: string
  image: string
  startDate: string
  endDate: string
  status: "upcoming" | "ongoing" | "ended"
  category: string
  participants: number
  maxParticipants?: number
  reward: string
  conditions: string[]
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "신년 특가 경매 이벤트",
    description: "새해를 맞아 특별한 할인가로 만나는 프리미엄 상품들! 최대 70% 할인된 가격으로 경매에 참여하세요.",
    image: "/placeholder.svg?height=200&width=300&text=신년특가",
    startDate: "2024-01-15",
    endDate: "2024-01-31",
    status: "ongoing",
    category: "할인",
    participants: 1234,
    maxParticipants: 5000,
    reward: "최대 70% 할인",
    conditions: ["회원 가입 필수", "기간 내 입찰 참여", "최소 1회 낙찰"],
  },
  {
    id: 2,
    title: "첫 판매 수수료 면제",
    description: "처음 판매하는 회원을 위한 특별 혜택! 첫 번째 상품 판매 시 수수료를 면제해드립니다.",
    image: "/placeholder.svg?height=200&width=300&text=수수료면제",
    startDate: "2024-01-10",
    endDate: "2024-02-29",
    status: "ongoing",
    category: "혜택",
    participants: 567,
    reward: "판매 수수료 100% 면제",
    conditions: ["신규 판매자", "첫 번째 상품 등록", "성공적인 판매 완료"],
  },
  {
    id: 3,
    title: "럭키 드로우 이벤트",
    description: "매일 참여하는 럭키 드로우! 매일 오후 6시에 추첨하여 다양한 상품을 증정합니다.",
    image: "/placeholder.svg?height=200&width=300&text=럭키드로우",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "ongoing",
    category: "추첨",
    participants: 2345,
    maxParticipants: 10000,
    reward: "매일 상품 증정",
    conditions: ["일일 로그인", "경매 참여 1회 이상", "추첨 응모"],
  },
  {
    id: 4,
    title: "친구 초대 이벤트",
    description: "친구를 초대하고 함께 혜택을 받으세요! 초대한 친구가 첫 거래를 완료하면 둘 다 리워드를 받습니다.",
    image: "/placeholder.svg?height=200&width=300&text=친구초대",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    status: "upcoming",
    category: "추천",
    participants: 0,
    reward: "초대자/피초대자 각각 10,000원 적립금",
    conditions: ["친구 초대 링크 공유", "친구의 회원가입", "친구의 첫 거래 완료"],
  },
  {
    id: 5,
    title: "크리스마스 특별 경매",
    description: "크리스마스를 맞아 진행된 특별 경매 이벤트입니다. 많은 분들의 참여로 성공적으로 마무리되었습니다.",
    image: "/placeholder.svg?height=200&width=300&text=크리스마스",
    startDate: "2023-12-20",
    endDate: "2023-12-25",
    status: "ended",
    category: "시즌",
    participants: 3456,
    maxParticipants: 3000,
    reward: "특가 상품 경매",
    conditions: ["이벤트 기간 내 참여", "크리스마스 테마 상품"],
  },
]

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  ended: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  upcoming: "예정",
  ongoing: "진행중",
  ended: "종료",
}

const categoryIcons = {
  할인: <Star className="w-4 h-4" />,
  혜택: <Gift className="w-4 h-4" />,
  추첨: <Trophy className="w-4 h-4" />,
  추천: <Users className="w-4 h-4" />,
  시즌: <Zap className="w-4 h-4" />,
}

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredEvents = events.filter((event) => {
    if (selectedStatus === "all") return true
    return event.status === selectedStatus
  })

  const ongoingEvents = events.filter((event) => event.status === "ongoing")
  const upcomingEvents = events.filter((event) => event.status === "upcoming")
  const endedEvents = events.filter((event) => event.status === "ended")

  const getParticipationRate = (event: Event) => {
    if (!event.maxParticipants) return 0
    return (event.participants / event.maxParticipants) * 100
  }

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">이벤트</h1>
          </div>
          <p className="text-gray-600">다양한 이벤트를 만나보세요!</p>
        </div>
        {/* 이벤트 필터 */}
        <div className="mb-6">
          <Button
            onClick={() => setSelectedStatus("all")}
            className={selectedStatus === "all" ? "bg-blue-500 text-white" : ""}
          >
            전체
          </Button>
          <Button
            onClick={() => setSelectedStatus("upcoming")}
            className={selectedStatus === "upcoming" ? "bg-blue-500 text-white" : ""}
          >
            예정
          </Button>
          <Button
            onClick={() => setSelectedStatus("ongoing")}
            className={selectedStatus === "ongoing" ? "bg-blue-500 text-white" : ""}
          >
            진행중
          </Button>
          <Button
            onClick={() => setSelectedStatus("ended")}
            className={selectedStatus === "ended" ? "bg-blue-500 text-white" : ""}
          >
            종료
          </Button>
        </div>
        {/* 이벤트 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {categoryIcons[event.category]}
                  {event.title}
                </CardTitle>
                <Badge className={statusColors[event.status]}>{statusLabels[event.status]}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-auto rounded-lg" />
                <p>{event.description}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {event.startDate} ~ {event.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {event.status === "upcoming" && `D-${getDaysLeft(event.endDate)}`}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  {event.participants} 명 참여
                  {event.maxParticipants && <Progress value={getParticipationRate(event)} className="w-full mt-2" />}
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gray-500" />
                  {event.reward}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">참가 조건</h3>
                  <ul className="list-disc list-inside">
                    {event.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
