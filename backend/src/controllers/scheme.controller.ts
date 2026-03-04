import { Request, Response, NextFunction } from 'express'
import schemeService from '../services/scheme.service'

export class SchemeController {
  async getAllSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        category: req.query.category as string,
        level: req.query.level as string,
        search: req.query.search as string,
        language: req.query.language as string || 'en',
      }
      const schemes = await schemeService.getAllSchemes(filters)
      res.status(200).json({
        status: 'success',
        data: schemes,
      })
    } catch (error) {
      next(error)
    }
  }

  async getSchemeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const language = req.query.language as string || 'en'
      const scheme = await schemeService.getSchemeById(id, language)
      res.status(200).json({
        status: 'success',
        data: scheme,
      })
    } catch (error) {
      next(error)
    }
  }

  async searchSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string
      const language = req.query.language as string || 'en'
      const schemes = await schemeService.searchSchemes(query, language)
      res.status(200).json({
        status: 'success',
        data: schemes,
      })
    } catch (error) {
      next(error)
    }
  }

  async compareSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const schemeIds = req.body.schemeIds as string[]
      const schemes = await schemeService.compareSchemes(schemeIds)
      res.status(200).json({
        status: 'success',
        data: schemes,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SchemeController()
