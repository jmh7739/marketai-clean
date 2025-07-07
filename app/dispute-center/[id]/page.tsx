import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MessageSquare, FileText, AlertTriangle } from "lucide-react"

interface DisputeCenterPageProps {
  params: Promise<{ id: string }>
}

export default async function DisputeCenterPage({ params }: DisputeCenterPageProps) {
  const { id } = await params

  // Mock dispute data - replace with actual data fetching
  const dispute = {
    id: id,
    title: "상품 미배송 분쟁",
    status: "pending",
    createdAt: "2024-01-15",
    description: "주문한 상품이 배송 예정일을 넘겨도 도착하지 않았습니다.",
    buyer: {
      name: "김구매자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    seller: {
      name: "박판매자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: {
      name: "아이폰 14 Pro",
      price: 1200000,
      image: "/placeholder.svg?height=100&width=100",
    },
    messages: [
      {
        id: 1,
        sender: "buyer",
        message: "상품을 주문한지 2주가 지났는데 아직 받지 못했습니다.",
        timestamp: "2024-01-15 10:00",
      },
      {
        id: 2,
        sender: "seller",
        message: "배송 지연으로 인해 죄송합니다. 확인해보겠습니다.",
        timestamp: "2024-01-15 14:30",
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            대기중
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            해결됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            거부됨
          </Badge>
        )
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">분쟁 상세</h1>
        <p className="text-muted-foreground">분쟁 ID: {dispute.id}</p>
      </div>

      <div className="grid gap-6">
        {/* 분쟁 개요 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {dispute.title}
              </CardTitle>
              {getStatusBadge(dispute.status)}
            </div>
            <CardDescription className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {dispute.createdAt}에 신고됨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{dispute.description}</p>

            {/* 관련 상품 정보 */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <img
                src={dispute.product.image || "/placeholder.svg"}
                alt={dispute.product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h4 className="font-medium">{dispute.product.name}</h4>
                <p className="text-sm text-muted-foreground">{dispute.product.price.toLocaleString()}원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 당사자 정보 */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">구매자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={dispute.buyer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{dispute.buyer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{dispute.buyer.name}</p>
                  <p className="text-sm text-muted-foreground">신고자</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">판매자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={dispute.seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{dispute.seller.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{dispute.seller.name}</p>
                  <p className="text-sm text-muted-foreground">피신고자</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 대화 내역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              대화 내역
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dispute.messages.map((message, index) => (
              <div key={message.id}>
                <div className={`flex gap-3 ${message.sender === "buyer" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "buyer" ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.sender === "buyer" ? dispute.buyer.name : dispute.seller.name}
                    </p>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                  </div>
                </div>
                {index < dispute.messages.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 관리자 응답 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              관리자 응답
            </CardTitle>
            <CardDescription>이 분쟁에 대한 관리자의 결정을 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="분쟁 해결 방안을 입력하세요..." className="min-h-[120px]" />
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">구매자 승리</Button>
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent">
                판매자 승리
              </Button>
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                분쟁 기각
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
