"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage, deleteImage } from "@/lib/database"
import { validateFileExtension, validateFileSize } from "@/lib/security"
import LoadingSpinner from "./LoadingSpinner"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  maxSizeMB?: number
  className?: string
}

export default function ImageUpload({
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5,
  className = "",
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"]

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 파일 개수 체크
    if (images.length + files.length > maxImages) {
      toast({
        title: "업로드 제한",
        description: `최대 ${maxImages}장까지 업로드 가능합니다`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        // 파일 검증
        if (!validateFileExtension(file.name, allowedExtensions)) {
          toast({
            title: "파일 형식 오류",
            description: `${file.name}: 지원하지 않는 파일 형식입니다`,
            variant: "destructive",
          })
          continue
        }

        if (!validateFileSize(file, maxSizeMB)) {
          toast({
            title: "파일 크기 오류",
            description: `${file.name}: 파일 크기가 ${maxSizeMB}MB를 초과합니다`,
            variant: "destructive",
          })
          continue
        }

        // 파일 업로드
        const timestamp = Date.now()
        const fileName = `products/${timestamp}_${file.name}`
        const result = await uploadImage(file, fileName)

        if (result.success && result.url) {
          uploadedUrls.push(result.url)
        } else {
          toast({
            title: "업로드 실패",
            description: `${file.name} 업로드에 실패했습니다`,
            variant: "destructive",
          })
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
        toast({
          title: "업로드 완료",
          description: `${uploadedUrls.length}장의 이미지가 업로드되었습니다`,
        })
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error)
      toast({
        title: "업로드 오류",
        description: "이미지 업로드 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)

    // Firebase Storage에서 이미지 삭제 (선택사항)
    try {
      const path = imageUrl.split("/").pop()
      if (path) {
        await deleteImage(`products/${path}`)
      }
    } catch (error) {
      console.error("이미지 삭제 오류:", error)
    }

    toast({
      title: "이미지 삭제",
      description: "이미지가 삭제되었습니다",
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const event = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(event)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 업로드 영역 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <LoadingSpinner text="이미지 업로드 중..." />
        ) : (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">이미지를 드래그하거나 클릭해서 업로드하세요</p>
            <p className="text-sm text-gray-500 mb-4">
              최대 {maxImages}장, {maxSizeMB}MB 이하, JPG/PNG/WEBP 형식
            </p>
            <Button type="button" variant="outline">
              이미지 선택
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 업로드된 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url || "/placeholder.svg"}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 상태 */}
      <div className="text-sm text-gray-500">
        {images.length}/{maxImages} 이미지 업로드됨
      </div>
    </div>
  )
}
