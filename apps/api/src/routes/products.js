const express = require("express")
const { PrismaClient } = require("@prisma/client")

const router = express.Router()
const prisma = new PrismaClient()

// 상품 목록 조회
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        auction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ error: "상품 목록을 불러오는 중 오류가 발생했습니다." })
  }
})

// 상품 등록
router.post("/", async (req, res) => {
  try {
    const { title, description, condition, categoryId, startingPrice, buyNowPrice, sellerId, images } = req.body

    const product = await prisma.product.create({
      data: {
        title,
        description,
        condition,
        categoryId,
        startingPrice: parseFloat(startingPrice),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
        sellerId,
        status: "DRAFT",
        images: {
          create:
            images?.map((image, index) => ({
              url: image.url,
              order: index,
            })) || [],
        },
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    })

    res.status(201).json({
      message: "상품이 등록되었습니다.",
      product,
    })
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ error: "상품 등록 중 오류가 발생했습니다." })
  }
})

module.exports = router