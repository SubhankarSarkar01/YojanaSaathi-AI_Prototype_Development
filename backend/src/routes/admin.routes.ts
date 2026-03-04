import { Router } from 'express'
import adminController from '../controllers/admin.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/admin.middleware'

const router = Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats)

// Schemes management
router.get('/schemes', adminController.getAllSchemes)
router.post('/schemes', adminController.createScheme)
router.put('/schemes/:id', adminController.updateScheme)
router.delete('/schemes/:id', adminController.deleteScheme)

// Applications management
router.get('/applications', adminController.getAllApplications)

// Users management
router.get('/users', adminController.getAllUsers)

export default router
