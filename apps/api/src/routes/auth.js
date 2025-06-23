const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")

const router = express.Router()
const prisma = new PrismaClient()

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { email, name, phone, password } = req.body

    // 이미 존재하는 사용자 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    })

    if (existingUser) {
      return res.status(400).json({ error: "이미 존재하는 이메일 또는 전화번호입니다." })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
      },
    })

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." })
  }
})

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." })
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." })
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "로그인이 완료되었습니다.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." })
  }
})

module.exports = router