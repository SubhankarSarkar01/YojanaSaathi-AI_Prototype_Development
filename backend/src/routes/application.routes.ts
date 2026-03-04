import { Router } from 'express'
import applicationController from '../controllers/application.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// All application routes require authentication
router.use(authenticate)

router.post('/', applicationController.createApplication)
router.get('/', applicationController.getUserApplications)
router.get('/:id', applicationController.getApplicationById)
router.post('/:id/submit', applicationController.submitApplication)
router.post('/:id/documents', applicationController.uploadDocument)
router.delete('/:id', applicationController.deleteApplication)

export default router
