import { Router } from 'express'
import schemeController from '../controllers/scheme.controller'

const router = Router()

router.get('/', schemeController.getAllSchemes)
router.get('/search', schemeController.searchSchemes)
router.post('/compare', schemeController.compareSchemes)
router.get('/:id', schemeController.getSchemeById)

export default router
