const express = require('express')
const { body, query, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { asyncHandler } = require('../middleware/errorHandler')
const { authenticateToken, optionalAuth } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all auctions
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['upcoming', 'active', 'ended', 'cancelled']),
  query('category').optional().isString(),
  query('sortBy').optional().isIn(['newest', 'ending_soon', 'price_low', 'price_high', 'popular'])
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const {
    page = 1,
    limit = 20,
    status = 'active',
    category,
    sortBy = 'ending_soon'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  // Build where clause
  const where = {
    status: status.toUpperCase()
  }

  if (category) {
    where.product = {
      categoryId: category
    }
  }

  // Build orderBy clause
  let orderBy = {}
  switch (sortBy) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'ending_soon':
      orderBy = { endTime: 'asc' }
      break
    case 'price_low':
      orderBy = { currentPrice: 'asc' }
      break
    case 'price_high':
      orderBy = { currentPrice: 'desc' }
      break
    case 'popular':
      orderBy = { bidCount: 'desc' }
      break
    default:
      orderBy = { endTime: 'asc' }
  }

  const [auctions, total] = await Promise.all([
    prisma.auction.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true
              }
            }
          }
        },
        bids: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            bidder: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.auction.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      auctions,
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

// Get single auction
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params

  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rating: true,
              reviewCount: true
            }
          }
        }
      },
      bids: {
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          bidder: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      winner: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  res.json({
    success: true,
    data: { auction }
  })
}))

// Create auction
router.post('/', [
  body('productId').isUUID(),
  body('startPrice').isFloat({ min: 0 }),
  body('buyNowPrice').optional().isFloat({ min: 0 }),
  body('reservePrice').optional().isFloat({ min: 0 }),
  body('duration').isInt({ min: 1, max: 30 }), // days
  body('autoExtend').optional().isBoolean()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const {
    productId,
    startPrice,
    buyNowPrice,
    reservePrice,
    duration,
    autoExtend = true
  } = req.body

  // Check if product exists and user owns it
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { auction: true }
  })

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    })
  }

  if (product.sellerId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to create auction for this product'
    })
  }

  if (product.auction) {
    return res.status(400).json({
      success: false,
      error: 'Product already has an auction'
    })
  }

  // Create auction
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + duration * 24 * 60 * 60 * 1000)

  const auction = await prisma.auction.create({
    data: {
      productId,
      sellerId: req.user.id,
      startPrice: parseFloat(startPrice),
      currentPrice: parseFloat(startPrice),
      buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
      reservePrice: reservePrice ? parseFloat(reservePrice) : null,
      startTime,
      endTime,
      autoExtend,
      status: 'ACTIVE'
    },
    include: {
      product: {
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  res.status(201).json({
    success: true,
    message: 'Auction created successfully',
    data: { auction }
  })
}))

// Place bid
router.post('/:id/bid', [
  body('amount').isFloat({ min: 0 }),
  body('isAutoBid').optional().isBoolean(),
  body('maxAmount').optional().isFloat({ min: 0 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { id } = req.params
  const { amount, isAutoBid = false, maxAmount } = req.body

  // Get auction with current highest bid
  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          seller: true
        }
      },
      bids: {
        orderBy: { amount: 'desc' },
        take: 1
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  // Check auction status
  if (auction.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      error: 'Auction is not active'
    })
  }

  // Check if auction has ended
  if (new Date() > auction.endTime) {
    return res.status(400).json({
      success: false,
      error: 'Auction has ended'
    })
  }

  // Check if user is not the seller
  if (auction.product.sellerId === req.user.id) {
    return res.status(400).json({
      success: false,
      error: 'Cannot bid on your own auction'
    })
  }

  // Check minimum bid amount
  const minBidAmount = auction.currentPrice + 1000 // Minimum increment
  if (parseFloat(amount) < minBidAmount) {
    return res.status(400).json({
      success: false,
      error: `Bid must be at least ${minBidAmount.toLocaleString()}원`
    })
  }

  // Create bid and update auction
  const [bid, updatedAuction] = await prisma.$transaction(async (tx) => {
    // Mark previous winning bids as not winning
    await tx.bid.updateMany({
      where: {
        auctionId: id,
        isWinning: true
      },
      data: {
        isWinning: false
      }
    })

    // Create new bid
    const newBid = await tx.bid.create({
      data: {
        auctionId: id,
        bidderId: req.user.id,
        amount: parseFloat(amount),
        isAutoBid,
        maxAmount: maxAmount ? parseFloat(maxAmount) : null,
        isWinning: true
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update auction
    const updated = await tx.auction.update({
      where: { id },
      data: {
        currentPrice: parseFloat(amount),
        bidCount: { increment: 1 }
      }
    })

    return [newBid, updated]
  })

  // TODO: Send real-time notification via WebSocket
  // TODO: Send email notification to previous highest bidder

  res.json({
    success: true,
    message: 'Bid placed successfully',
    data: {
      bid,
      auction: updatedAuction
    }
  })
}))

// End auction (admin or seller only)
router.post('/:id/end', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params

  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      product: true,
      bids: {
        where: { isWinning: true },
        include: {
          bidder: true
        }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  // Check permissions
  if (auction.product.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to end this auction'
    })
  }

  if (auction.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      error: 'Auction is not active'
    })
  }

  // End auction
  const winningBid = auction.bids[0]
  const updatedAuction = await prisma.auction.update({
    where: { id },
    data: {
      status: 'ENDED',
      winnerId: winningBid?.bidderId || null
    }
  })

  // Update product status
  await prisma.product.update({
    where: { id: auction.productId },
    data: {
      status: winningBid ? 'SOLD' : 'ACTIVE'
    }
  })

  res.json({
    success: true,
    message: 'Auction ended successfully',
    data: { auction: updatedAuction }
  })
}))

module.exports = router