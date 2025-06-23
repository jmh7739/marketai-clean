const express = require("express")
const { PrismaClient } = require("@prisma/client")

const router = express.Router()
const prisma = new PrismaClient()

// 경매 목록 조회
router.get("/", async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
            images: true,
          },
        },
        bids: {
          include: {
            bidder: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        endTime: "asc",
      },
    })

    res.json(auctions)
  } catch (error) {
    console.error("Get auctions error:", error)
    res.status(500).json({ error: "경매 목록을 불러오는 중 오류가 발생했습니다." })
  }
})

module.exports = router