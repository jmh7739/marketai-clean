import { supabase } from "./supabase-client"

export interface UserRating {
  userId: string
  overallRating: number // 5.0 만점
  totalReviews: number
  transactionCount: number
  trustScore: number // 0-100점
  ratingBreakdown: {
    accuracy: number
    communication: number
    shipping: number
    overall: number
  }
}

export interface Review {
  id: string
  transactionId: string
  reviewerId: string
  revieweeId: string
  ratings: {
    accuracy: number
    communication: number
    shipping: number
    overall: number
  }
  comment?: string
  photos?: string[]
  createdAt: string
  editedAt?: string
}

export class RatingSystem {
  // 리뷰 작성
  static async createReview(data: {
    transactionId: string
    reviewerId: string
    revieweeId: string
    ratings: {
      accuracy: number
      communication: number
      shipping: number
      overall: number
    }
    comment?: string
    photos?: File[]
  }) {
    try {
      // 거래 확인
      const { data: transaction } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", data.transactionId)
        .single()

      if (!transaction) {
        return { success: false, error: "거래를 찾을 수 없습니다" }
      }

      // 리뷰 권한 확인
      if (transaction.buyer_id !== data.reviewerId && transaction.seller_id !== data.reviewerId) {
        return { success: false, error: "리뷰 작성 권한이 없습니다" }
      }

      // 기존 리뷰 확인
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("transaction_id", data.transactionId)
        .eq("reviewer_id", data.reviewerId)
        .single()

      if (existingReview) {
        return { success: false, error: "이미 리뷰를 작성했습니다" }
      }

      // 사진 업로드
      let photoUrls: string[] = []
      if (data.photos && data.photos.length > 0) {
        photoUrls = await this.uploadReviewPhotos(data.photos)
      }

      // 리뷰 생성
      const { data: review } = await supabase
        .from("reviews")
        .insert({
          transaction_id: data.transactionId,
          reviewer_id: data.reviewerId,
          reviewee_id: data.revieweeId,
          accuracy_rating: data.ratings.accuracy,
          communication_rating: data.ratings.communication,
          shipping_rating: data.ratings.shipping,
          overall_rating: data.ratings.overall,
          comment: data.comment,
          photos: photoUrls,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 평점 업데이트
      await this.updateUserRating(data.revieweeId)

      return { success: true, reviewId: review.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 사용자 평점 업데이트
  static async updateUserRating(userId: string) {
    try {
      // 모든 리뷰 조회
      const { data: reviews } = await supabase.from("reviews").select("*").eq("reviewee_id", userId)

      if (!reviews || reviews.length === 0) return

      // 평점 계산
      const totalReviews = reviews.length
      const avgAccuracy = reviews.reduce((sum, r) => sum + r.accuracy_rating, 0) / totalReviews
      const avgCommunication = reviews.reduce((sum, r) => sum + r.communication_rating, 0) / totalReviews
      const avgShipping = reviews.reduce((sum, r) => sum + r.shipping_rating, 0) / totalReviews
      const avgOverall = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews

      // 거래 횟수 조회
      const { count: transactionCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .eq("status", "completed")

      // 신뢰도 점수 계산 (0-100점)
      const trustScore = this.calculateTrustScore(avgOverall, totalReviews, transactionCount || 0)

      // 사용자 평점 업데이트
      await supabase.from("user_ratings").upsert({
        user_id: userId,
        overall_rating: Math.round(avgOverall * 10) / 10, // 소수점 1자리
        total_reviews: totalReviews,
        transaction_count: transactionCount || 0,
        trust_score: trustScore,
        accuracy_rating: Math.round(avgAccuracy * 10) / 10,
        communication_rating: Math.round(avgCommunication * 10) / 10,
        shipping_rating: Math.round(avgShipping * 10) / 10,
        updated_at: new Date().toISOString(),
      })

      return { success: true }
    } catch (error) {
      console.error("평점 업데이트 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 신뢰도 점수 계산
  private static calculateTrustScore(avgRating: number, reviewCount: number, transactionCount: number): number {
    // 기본 점수 (평점 기반)
    let score = (avgRating / 5.0) * 60 // 최대 60점

    // 리뷰 수 보너스 (최대 20점)
    const reviewBonus = Math.min(reviewCount * 2, 20)
    score += reviewBonus

    // 거래 횟수 보너스 (최대 20점)
    const transactionBonus = Math.min(transactionCount, 20)
    score += transactionBonus

    return Math.round(score)
  }

  // 사용자 평점 조회
  static async getUserRating(userId: string): Promise<UserRating | null> {
    try {
      const { data } = await supabase.from("user_ratings").select("*").eq("user_id", userId).single()

      if (!data) return null

      return {
        userId: data.user_id,
        overallRating: data.overall_rating,
        totalReviews: data.total_reviews,
        transactionCount: data.transaction_count,
        trustScore: data.trust_score,
        ratingBreakdown: {
          accuracy: data.accuracy_rating,
          communication: data.communication_rating,
          shipping: data.shipping_rating,
          overall: data.overall_rating,
        },
      }
    } catch (error) {
      console.error("평점 조회 오류:", error)
      return null
    }
  }

  // 리뷰 사진 업로드
  private static async uploadReviewPhotos(photos: File[]): Promise<string[]> {
    const urls: string[] = []

    for (const photo of photos) {
      const fileName = `review-photos/${Date.now()}_${photo.name}`
      const { data } = await supabase.storage.from("reviews").upload(fileName, photo)

      if (data) urls.push(data.path)
    }

    return urls
  }

  // 리뷰 수정
  static async editReview(
    reviewId: string,
    reviewerId: string,
    updates: {
      ratings?: {
        accuracy: number
        communication: number
        shipping: number
        overall: number
      }
      comment?: string
    },
  ) {
    try {
      // 수정 권한 및 시간 제한 확인
      const { data: review } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", reviewId)
        .eq("reviewer_id", reviewerId)
        .single()

      if (!review) {
        return { success: false, error: "리뷰를 찾을 수 없습니다" }
      }

      const editTimeLimit = 24 * 60 * 60 * 1000 // 24시간
      if (Date.now() - new Date(review.created_at).getTime() > editTimeLimit) {
        return { success: false, error: "수정 가능 시간이 지났습니다" }
      }

      // 리뷰 수정
      const updateData: any = {
        edited_at: new Date().toISOString(),
      }

      if (updates.ratings) {
        updateData.accuracy_rating = updates.ratings.accuracy
        updateData.communication_rating = updates.ratings.communication
        updateData.shipping_rating = updates.ratings.shipping
        updateData.overall_rating = updates.ratings.overall
      }

      if (updates.comment !== undefined) {
        updateData.comment = updates.comment
      }

      await supabase.from("reviews").update(updateData).eq("id", reviewId)

      // 평점 재계산
      await this.updateUserRating(review.reviewee_id)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
