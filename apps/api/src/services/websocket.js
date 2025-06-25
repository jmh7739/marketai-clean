const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const setupWebSocket = (io) => {
  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      })

      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected`)

    // Join auction room
    socket.on('join-auction', async (data) => {
      const { auctionId } = data
      
      try {
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            product: {
              select: {
                title: true,
                sellerId: true
              }
            }
          }
        })

        if (auction) {
          socket.join(`auction-${auctionId}`)
          socket.currentAuction = auctionId
          
          // Notify others that user joined
          socket.to(`auction-${auctionId}`).emit('user-joined', {
            user: socket.user,
            timestamp: new Date()
          })

          console.log(`User ${socket.user.name} joined auction ${auctionId}`)
        }
      } catch (error) {
        console.error('Error joining auction:', error)
        socket.emit('error', { message: 'Failed to join auction' })
      }
    })

    // Leave auction room
    socket.on('leave-auction', (data) => {
      const { auctionId } = data
      
      if (socket.currentAuction === auctionId) {
        socket.leave(`auction-${auctionId}`)
        socket.to(`auction-${auctionId}`).emit('user-left', {
          user: socket.user,
          timestamp: new Date()
        })
        socket.currentAuction = null
        console.log(`User ${socket.user.name} left auction ${auctionId}`)
      }
    })

    // Place bid
    socket.on('place-bid', async (data) => {
      const { auctionId, amount } = data

      try {
        // Validate bid (simplified - should use the same logic as API route)
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            product: true,
            bids: {
              orderBy: { amount: 'desc' },
              take: 1
            }
          }
        })

        if (!auction || auction.status !== 'ACTIVE') {
          socket.emit('bid-error', { message: 'Auction is not active' })
          return
        }

        if (auction.product.sellerId === socket.userId) {
          socket.emit('bid-error', { message: 'Cannot bid on your own auction' })
          return
        }

        const minBidAmount = auction.currentPrice + 1000
        if (amount < minBidAmount) {
          socket.emit('bid-error', { 
            message: `Bid must be at least ${minBidAmount.toLocaleString()}원` 
          })
          return
        }

        // Create bid (simplified transaction)
        await prisma.bid.updateMany({
          where: {
            auctionId,
            isWinning: true
          },
          data: { isWinning: false }
        })

        const bid = await prisma.bid.create({
          data: {
            auctionId,
            bidderId: socket.userId,
            amount: parseFloat(amount),
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

        await prisma.auction.update({
          where: { id: auctionId },
          data: {
            currentPrice: parseFloat(amount),
            bidCount: { increment: 1 }
          }
        })

        // Broadcast new bid to all users in auction room
        io.to(`auction-${auctionId}`).emit('new-bid', {
          bid,
          auction: {
            id: auctionId,
            currentPrice: parseFloat(amount),
            bidCount: auction.bidCount + 1
          },
          timestamp: new Date()
        })

        console.log(`New bid placed: ${amount} by ${socket.user.name} on auction ${auctionId}`)

      } catch (error) {
        console.error('Error placing bid:', error)
        socket.emit('bid-error', { message: 'Failed to place bid' })
      }
    })

    // Send message in auction chat
    socket.on('send-message', async (data) => {
      const { auctionId, message } = data

      try {
        if (socket.currentAuction !== auctionId) {
          socket.emit('error', { message: 'Not in auction room' })
          return
        }

        // Create message record
        const messageRecord = await prisma.message.create({
          data: {
            content: message,
            senderId: socket.userId,
            receiverId: 'auction', // Special receiver for auction messages
            type: 'TEXT'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        })

        // Broadcast message to auction room
        io.to(`auction-${auctionId}`).emit('new-message', {
          message: messageRecord,
          timestamp: new Date()
        })

      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.currentAuction) {
        socket.to(`auction-${socket.currentAuction}`).emit('user-left', {
          user: socket.user,
          timestamp: new Date()
        })
      }
      console.log(`User ${socket.user.name} disconnected`)
    })
  })

  // Auction end notification (called from auction service)
  const notifyAuctionEnd = (auctionId, auctionData) => {
    io.to(`auction-${auctionId}`).emit('auction-ended', {
      auction: auctionData,
      timestamp: new Date()
    })
  }

  // Bid notification (called from bid service)
  const notifyOutbid = (userId, auctionData) => {
    io.emit('outbid-notification', {
      userId,
      auction: auctionData,
      timestamp: new Date()
    })
  }

  return {
    notifyAuctionEnd,
    notifyOutbid
  }
}

module.exports = { setupWebSocket }