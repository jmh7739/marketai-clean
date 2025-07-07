export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: "jpeg" | "png" | "webp"
  removeExif?: boolean
}

export class ImageOptimizer {
  static async optimizeImage(file: File, options: ImageOptimizationOptions = {}): Promise<File> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 0.8, format = "jpeg", removeExif = true } = options

    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth, maxHeight)

        canvas.width = width
        canvas.height = height

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height)

        // Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], this.generateFileName(file.name, format), {
                type: `image/${format}`,
              })
              resolve(optimizedFile)
            } else {
              reject(new Error("이미지 최적화 실패"))
            }
          },
          `image/${format}`,
          quality,
        )
      }

      img.onerror = () => reject(new Error("이미지 로드 실패"))

      // EXIF 제거를 위해 crossOrigin 설정
      if (removeExif) {
        img.crossOrigin = "anonymous"
      }

      img.src = URL.createObjectURL(file)
    })
  }

  static async createThumbnail(file: File, size = 300): Promise<File> {
    return this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: "jpeg",
    })
  }

  static async optimizeMultipleImages(files: File[], options?: ImageOptimizationOptions): Promise<File[]> {
    const promises = files.map((file) => this.optimizeImage(file, options))
    return Promise.all(promises)
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight }

    // 최대 크기를 초과하는 경우 비율 유지하면서 축소
    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width
      const heightRatio = maxHeight / height
      const ratio = Math.min(widthRatio, heightRatio)

      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    return { width, height }
  }

  private static generateFileName(originalName: string, format: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
    return `${nameWithoutExt}_optimized.${format}`
  }

  static getImageInfo(file: File): Promise<{
    width: number
    height: number
    size: number
    type: string
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
        })
      }

      img.onerror = () => reject(new Error("이미지 정보 로드 실패"))
      img.src = URL.createObjectURL(file)
    })
  }
}

// 사용 예시
export const optimizeProductImages = async (files: File[]): Promise<File[]> => {
  const optimized = await ImageOptimizer.optimizeMultipleImages(files, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    format: "jpeg",
    removeExif: true,
  })

  return optimized
}

export const createProductThumbnails = async (files: File[]): Promise<File[]> => {
  const thumbnails = await Promise.all(files.map((file) => ImageOptimizer.createThumbnail(file, 300)))

  return thumbnails
}
