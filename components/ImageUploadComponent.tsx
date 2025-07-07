"use client"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ImageIcon } from "lucide-react"
import { uploadImage, deleteImage } from "@/lib/vercel-blob"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadComponentProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  folder?: string
}

export function ImageUploadComponent({
  images,
  onImagesChange,
  maxImages = 10,
  folder = "auctions",
}: ImageUploadComponentProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          const url = await uploadImage(file, folder)
          setUploadProgress(((index + 1) / acceptedFiles.length) * 100)
          return url
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        onImagesChange([...images, ...uploadedUrls])
        toast.success(`${uploadedUrls.length}개의 이미지가 업로드되었습니다.`)
      } catch (error) {
        toast.error("이미지 업로드에 실패했습니다.")
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [images, onImagesChange, maxImages, folder],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  })

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]
    try {
      await deleteImage(imageUrl)
      const newImages = images.filter((_, i) => i !== index)
      onImagesChange(newImages)
      toast.success("이미지가 삭제되었습니다.")
    } catch (error) {
      toast.error("이미지 삭제에 실패했습니다.")
    }
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
              ${uploading || images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600">이미지를 여기에 놓으세요...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">이미지를 드래그하거나 클릭하여 업로드하세요</p>
                <p className="text-sm text-gray-500">JPG, PNG, WebP 파일 (최대 5MB, {maxImages}개까지)</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">업로드 중...</span>
                <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 업로드된 이미지 목록 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`업로드된 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">대표</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ImageIcon className="w-4 h-4" />
          <span>
            {images.length}/{maxImages}개 이미지 업로드됨
          </span>
        </div>
      )}
    </div>
  )
}
