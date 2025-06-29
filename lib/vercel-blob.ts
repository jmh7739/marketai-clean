import { put, del } from "@vercel/blob"

export class BlobService {
  static async uploadImage(file: File, path: string): Promise<{ url: string; error?: string }> {
    try {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        return { url: "", error: "파일 크기는 5MB 이하여야 합니다." }
      }

      // 파일 형식 검증
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        return { url: "", error: "지원하지 않는 파일 형식입니다." }
      }

      // 고유한 파일명 생성
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const filename = `${path}/${timestamp}-${randomString}.${extension}`

      const blob = await put(filename, file, {
        access: "public",
      })

      return { url: blob.url }
    } catch (error) {
      console.error("Image upload error:", error)
      return { url: "", error: "이미지 업로드에 실패했습니다." }
    }
  }

  static async deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
    try {
      await del(url)
      return { success: true }
    } catch (error) {
      console.error("Image delete error:", error)
      return { success: false, error: "이미지 삭제에 실패했습니다." }
    }
  }

  static async uploadMultipleImages(files: File[], path: string): Promise<{ urls: string[]; errors: string[] }> {
    const urls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      const result = await this.uploadImage(file, path)
      if (result.error) {
        errors.push(`${file.name}: ${result.error}`)
      } else {
        urls.push(result.url)
      }
    }

    return { urls, errors }
  }
}
