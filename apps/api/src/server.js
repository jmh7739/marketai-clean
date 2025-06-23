const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { PrismaClient } = require("@prisma/client")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// 미들웨어 설정
app.use(helmet())
app.use(cors())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "MarketAI API Server",
    version: "1.0.0",
    status: "running",
  })
})

// 헬스 체크
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    })
  }
})

// API 라우트
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
app.use("/api/auctions", require("./routes/auctions"))

// 404 핸들러
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 MarketAI API Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit(0)
})