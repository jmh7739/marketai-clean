const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const prisma = new PrismaClient()

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    },
    where: {
      parentId: null // Only get top-level categories
    },
    orderBy: {
      name: 'asc'
    }
  })

  res.json({
    success: true,
    data: { categories }
  })
}))

// Get single category
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    }
  })

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    })
  }

  res.json({
    success: true,
    data: { category }
  })
}))

// Get category products
router.get('/:id/products', asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    page = 1,
    limit = 20,
    sortBy = 'newest'
  } = req.query

  const skip = (parseInt(page) - 1) * parseInt(limit)

  // Build orderBy clause
  let orderBy = {}
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'price_low':
      orderBy = { price: 'asc' }
      break
    case 'price_high':
      orderBy = { price: 'desc' }
      break
    case 'popular':
      orderBy = { views: 'desc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: id,
        status: 'ACTIVE'
      },
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true
          }
        },
        auction: {
          select: {
            id: true,
            currentPrice: true,
            endTime: true,
            status: true,
            bidCount: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    }),
    prisma.product.count({
      where: {
        categoryId: id,
        status: 'ACTIVE'
      }
    })
  ])

  const totalPages = Math.ceil(total / parseInt(limit))

  res.json({
    success: true,
    data: {
      products,
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