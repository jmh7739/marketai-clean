const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,webp').split(',')
    const fileExt = path.extname(file.originalname).toLowerCase().slice(1)
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true)
    } else {
      cb(new Error(`File type .${fileExt} is not allowed`), false)
    }
  }
})

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../uploads/images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Upload images
router.post('/images', authenticateToken, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files uploaded'
    })
  }

  const uploadedFiles = []

  for (const file of req.files) {
    try {
      const fileId = uuidv4()
      const fileName = `${fileId}.webp`
      const filePath = path.join(uploadDir, fileName)

      // Process image with sharp
      await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(filePath)

      // Generate thumbnail
      const thumbnailName = `${fileId}_thumb.webp`
      const thumbnailPath = path.join(uploadDir, thumbnailName)
      
      await sharp(file.buffer)
        .resize(200, 200, {
          fit: 'cover'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath)

      uploadedFiles.push({
        id: fileId,
        originalName: file.originalname,
        fileName,
        thumbnailName,
        url: `/uploads/images/${fileName}`,
        thumbnailUrl: `/uploads/images/${thumbnailName}`,
        size: file.size,
        mimeType: 'image/webp'
      })
    } catch (error) {
      console.error('Error processing image:', error)
      return res.status(500).json({
        success: false,
        error: 'Error processing image'
      })
    }
  }

  res.json({
    success: true,
    message: `${uploadedFiles.length} files uploaded successfully`,
    data: { files: uploadedFiles }
  })
}))

// Delete image
router.delete('/images/:fileId', authenticateToken, asyncHandler(async (req, res) => {
  const { fileId } = req.params

  try {
    const fileName = `${fileId}.webp`
    const thumbnailName = `${fileId}_thumb.webp`
    
    const filePath = path.join(uploadDir, fileName)
    const thumbnailPath = path.join(uploadDir, thumbnailName)

    // Delete files if they exist
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath)
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({
      success: false,
      error: 'Error deleting file'
    })
  }
}))

// Get image info
router.get('/images/:fileId', asyncHandler(async (req, res) => {
  const { fileId } = req.params
  const fileName = `${fileId}.webp`
  const filePath = path.join(uploadDir, fileName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found'
    })
  }

  const stats = fs.statSync(filePath)

  res.json({
    success: true,
    data: {
      id: fileId,
      fileName,
      url: `/uploads/images/${fileName}`,
      thumbnailUrl: `/uploads/images/${fileId}_thumb.webp`,
      size: stats.size,
      createdAt: stats.birthtime,
      mimeType: 'image/webp'
    }
  })
}))

module.exports = router