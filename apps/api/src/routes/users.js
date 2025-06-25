const express = require('express')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      address: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          products: true,
          auctions: true,
          bids: true
        }
      }
    }
  })

  res.json({
    success: true,
    data: { user }
  })
}))

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().isMobilePhone('ko-KR'),
  body('address').optional().trim().isLength({ max: 200 }),
  body('avatar').optional().isURL()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const updateData = {}
  const { name, phone, address, avatar } = req.body

  if (name) updateData.name = name
  if (phone) updateData.phone = phone
  if (address) updateData.address = address
  if (avatar) updateData.avatar = avatar

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      address: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      updatedAt: true
    }
  })

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  })
}))

// Change password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password)
  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    })
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12)

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword }
  })

  res.json({
    success: true,
    message: 'Password changed successfully'
  })
}))

// Get user's bids
router.get('/bids', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status = 'all' // 'winning', 'outbid', 'won', 'lost', 'all'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  let where = {
    bidderId: req.user.id
  }

  // Add status filter
  if (status === 'winning') {
    where.isWinning = true
    where.auction = { status: 'ACTIVE' }
  } else if (status === 'outbid') {
    where.isWinning = false
    where.auction = { status: 'ACTIVE' }
  } else if (status === 'won') {
    where.isWinning = true
    where.auction = { status: 'ENDED' }
  } else if (status === 'lost') {
    where.isWinning = false
    where.auction = { status: 'ENDED' }
  }

  const [bids, total] = await Promise.all([
    prisma.bid.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        auction: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            }
          }
        }
      }
    }),
    prisma.bid.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      bids,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

// Get user's notifications
router.get('/notifications', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = {
    userId: req.user.id
  }

  if (unreadOnly === 'true') {
    where.isRead = false
  }

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    }
  })
}))

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: req.user.id
    }
  })

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    })
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  })

  res.json({
    success: true,
    message: 'Notification marked as read'
  })
}))

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false
    },
    data: { isRead: true }
  })

  res.json({
    success: true,
    message: 'All notifications marked as read'
  })
}))

module.exports = router