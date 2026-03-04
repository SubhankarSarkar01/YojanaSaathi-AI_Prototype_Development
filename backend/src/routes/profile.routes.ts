import { Router } from 'express'
import profileController from '../controllers/profile.controller'
import { authenticate } from '../middleware/auth.middleware'
import { upload } from '../utils/fileUpload'

const router = Router()

// All profile routes require authentication
router.use(authenticate)

// File upload fields for documents
const documentUpload = upload.fields([
  { name: 'aadhaar_document', maxCount: 1 },
  { name: 'pan_document', maxCount: 1 },
  { name: 'voter_card_document', maxCount: 1 },
])

router.post('/', documentUpload, profileController.createProfile)
router.get('/', profileController.getProfile)
router.put('/', documentUpload, profileController.updateProfile)
router.delete('/', profileController.deleteProfile)
router.get('/document/:filename', profileController.getDocument)

export default router
