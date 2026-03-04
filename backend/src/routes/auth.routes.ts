import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authRateLimiter } from '../middleware/rateLimit.middleware'

const router = Router()

router.post('/register', authRateLimiter, authController.register)
router.post('/login', authRateLimiter, authController.login)
router.post('/forgot-password', authRateLimiter, authController.forgotPassword)
router.post('/reset-password', authRateLimiter, authController.resetPassword)
router.get('/me', authenticate, authController.getMe)

export default router
