"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, Camera, CheckCircle, MessageCircle } from "lucide-react"
import type { ReviewData } from "@/types/admin"

interface ReviewSystemProps {
  productId: string
  productTitle: string
  canReview?: boolean
}

export default function ReviewSystem({ productId, productTitle, canReview = false }: ReviewSystemProps) {
  const [reviews] = useState<ReviewData[]>([
    {
      id: "1",
      productId,
      productTitle,
      userId: "user1",
      userName: "김철수",
      rating: 5,
      comment:
        "정말 만족스러운 구매였습니다. 상품 상태도 설명과 정확히 일치하고, 배송도 빨랐어요. 판매자님도 친절하셨습니다.",
      images: ["/placeholder.svg?height=100&width=100&text=Review1"],
      createdAt: "2024-06-15",
      isVerified: true,
    },
    {
      id: "2",
      productId,
      productTitle,
      userId: "user2",
      userName: "이영희",
      rating: 4,
      comment: "전체적으로 좋은 상품이에요. 다만 생각보다 사용감이 조금 있었지만 가격 대비 만족합니다.",
      createdAt: "2024-06-10",
      isVerified: true,
    },
    {
      id: "3",
      productId,
      productTitle,
      userId: "user3",
      userName: "박민수",
      rating: 5,
      comment: "완전 새상품이네요! 포장도 꼼꼼히 해주시고 감사합니다.",
      images: [
        "/placeholder.svg?height=100&width=100&text=Review2",
        "/placeholder.svg?height=100&width=100&text=Review3",
      ],
      createdAt: "2024-06-08",
      isVerified: false,
    },
  ])

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    images: [] as string[],
  })

  const [showReviewForm, setShowReviewForm] = useState(false)

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  const handleSubmitReview = () => {
    // 리뷰 제출 로직
    console.log("새 리뷰:", newReview)
    setShowReviewForm(false)
    setNewReview({ rating: 0, comment: "", images: [] })
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 리뷰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 평점 요약 */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-gray-600">{reviews.length}개의 리뷰</p>
            </div>

            {/* 평점 분포 */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating}점</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 작성 버튼 */}
          {canReview && (
            <div className="mt-6 pt-6 border-t">
              <Button onClick={() => setShowReviewForm(true)} className="w-full">
                <Star className="w-4 h-4 mr-2" />
                리뷰 작성하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 리뷰 작성 폼 */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>리뷰 작성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">평점</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">리뷰 내용</label>
              <Textarea
                placeholder="상품에 대한 솔직한 후기를 남겨주세요..."
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">사진 첨부 (선택)</label>
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSubmitReview} className="flex-1">
                리뷰 등록
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)} className="flex-1">
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${review.userName[0]}`} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.isVerified && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        구매 확인
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">{review.createdAt}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">{renderStars(review.rating)}</div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>도움됨 (12)</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700">
                      <MessageCircle className="w-4 h-4" />
                      <span>답글</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
