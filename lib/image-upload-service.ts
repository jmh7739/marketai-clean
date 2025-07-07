import { supabase } from "./supabase-client"

export class ImageUploadService {
  private static readonly BUCKET_NAME = "auction-images"
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

  static async uploadImage(file: File, auctionId: string): Promise<string> {
    // 파일 검증
    if (!this.validateFile(file)) {
      throw new Error("지원하지 않는 파일 형식이거나 크기가 너무 큽니다.")
    }

    // 파일명 생성 (중복 방지)
    const fileExt = file.name.split(".").pop()
    const fileName = `${auctionId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

    try {
      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage.from(this.BUCKET_NAME).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw new Error(`업로드 실패: ${error.message}`)
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error("이미지 업로드 오류:", error)
      throw new Error("이미지 업로드에 실패했습니다.")
    }
  }

  static async uploadMultipleImages(files: File[], auctionId: string): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, auctionId))
    return Promise.all(uploadPromises)
  }

  static validateFile(file: File): boolean {
    // 파일 크기 검증
    if (file.size > this.MAX_FILE_SIZE) {
      return false
    }

    // 파일 타입 검증
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return false
    }

    return true
  }

  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // URL에서 파일 경로 추출
      const urlParts = imageUrl.split("/")
      const fileName = urlParts.slice(-2).join("/") // auctionId/filename

      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([fileName])

      return !error
    } catch (error) {
      console.error("이미지 삭제 오류:", error)
      return false
    }
  }
}
