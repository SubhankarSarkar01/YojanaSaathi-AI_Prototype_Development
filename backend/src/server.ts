import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import Redis from 'ioredis'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import schemeRoutes from './routes/scheme.routes'
import applicationRoutes from './routes/application.routes'
import adminRoutes from './routes/admin.routes'
import chatbotRoutes from './routes/chatbot.routes'

// Import middleware
import { errorHandler } from './middleware/error.middleware'
import { rateLimiter } from './middleware/rateLimit.middleware'

// Import config
import { AppDataSource } from './config/database'
import { redisConfig } from './config/redis'
import logger from './utils/logger'

const app: Application = express()
const PORT = process.env.PORT || 3000
const allowedOrigins = Array.from(
  new Set(
    [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(
      (origin): origin is string => Boolean(origin)
    )
  )
)

// Middleware
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use(rateLimiter)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/schemes', schemeRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chatbot', chatbotRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use(errorHandler)

// Initialize database and start server
async function startServer() {
  try {
    // Connect to MySQL using DataSource
    await AppDataSource.initialize()
    logger.info('✅ Connected to MySQL')

    // Try to connect to Redis (optional)
    if (process.env.REDIS_HOST) {
      try {
        const redis = new Redis(redisConfig)
        redis.on('connect', () => {
          logger.info('✅ Connected to Redis')
        })
        redis.on('error', (err) => {
          logger.warn('⚠️  Redis connection error (optional):', err.message)
        })
      } catch (err) {
        logger.warn('⚠️  Redis not available (optional)')
      }
    } else {
      logger.info('ℹ️  Redis disabled (not configured)')
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`🌐 API: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Start the server
startServer()

export default app
