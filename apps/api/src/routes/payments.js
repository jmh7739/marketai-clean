const express = require('express')
const { body, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Mock payment processing - replace with actual payment provider
const processPayment = async (amount, paymentMethodId) => {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `payment_${Date.now()}`,
        status: 'succeeded',
        amount,
        currency: 'krw'
      })
    }, 1000)
  })
}

// Create payment intent
router.post('/create-intent', [
  body('auctionId').isUUID(),
  body('amount').isFloat({ min: 0 })
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { auctionId, amount } = req.body

  // Verify auction and user is winner
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      product: true,
      bids: {
        where: { isWinning: true },
        include: { bidder: true }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  if (auction.status !== 'ENDED') {
    return res.status(400).json({
      success: false,
      error: 'Auction has not ended'
    })
  }

  const winningBid = auction.bids[0]
  if (!winningBid || winningBid.bidderId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'You are not the winner of this auction'
    })
  }

  if (parseFloat(amount) !== winningBid.amount) {
    return res.status(400).json({
      success: false,
      error: 'Payment amount does not match winning bid'
    })
  }

  // Create payment intent (mock)
  const paymentIntent = {
    id: `pi_${Date.now()}`,
    amount: parseFloat(amount),
    currency: 'krw',
    status: 'requires_payment_method',
    clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
  }

  res.json({
    success: true,
    data: { paymentIntent }
  })
}))

// Confirm payment
router.post('/confirm', [
  body('paymentIntentId').notEmpty(),
  body('paymentMethodId').notEmpty(),
  body('auctionId').isUUID()
], authenticateToken, asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }

  const { paymentIntentId, paymentMethodId, auctionId } = req.body

  // Get auction details
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      product: {
        include: { seller: true }
      },
      bids: {
        where: { isWinning: true }
      }
    }
  })

  if (!auction) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    })
  }

  const winningBid = auction.bids[0]
  
  try {
    // Process payment (mock)
    const payment = await processPayment(winningBid.amount, paymentMethodId)

    if (payment.status === 'succeeded') {
      // Create payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          id: payment.id,
          auctionId,
          buyerId: req.user.id,
          sellerId: auction.product.sellerId,
          amount: payment.amount,
          currency: payment.currency,
          status: 'COMPLETED',
          paymentMethod: 'card',
          paymentIntentId
        }
      })

      // Update product status
      await prisma.product.update({
        where: { id: auction.productId },
        data: { status: 'SOLD' }
      })

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment: paymentRecord,
          auction
        }
      })
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed'
      })
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    })
  }
}))

// Get payment history
router.get('/history', authenticateToken, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type = 'all' // 'purchases', 'sales', 'all'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  let where = {}
  if (type === 'purchases') {
    where.buyerId = req.user.id
  } else if (type === 'sales') {
    where.sellerId = req.user.id
  } else {
    where.OR = [
      { buyerId: req.user.id },
      { sellerId: req.user.id }
    ]
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    }),
    prisma.payment.count({ where })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      payments,
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

module.exports = router