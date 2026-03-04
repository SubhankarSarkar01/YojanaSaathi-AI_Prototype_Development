import { Request, Response, NextFunction } from 'express'
import applicationService from '../services/application.service'

export class ApplicationController {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { schemeId } = req.body
      const application = await applicationService.createApplication(userId, schemeId)
      res.status(201).json({
        status: 'success',
        data: application,
      })
    } catch (error) {
      next(error)
    }
  }

  async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { id } = req.params
      const application = await applicationService.getApplicationById(id, userId)
      res.status(200).json({
        status: 'success',
        data: application,
      })
    } catch (error) {
      next(error)
    }
  }

  async getUserApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const applications = await applicationService.getUserApplications(userId)
      res.status(200).json({
        status: 'success',
        data: applications,
      })
    } catch (error) {
      next(error)
    }
  }

  async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { id } = req.params
      const application = await applicationService.submitApplication(id, userId)
      res.status(200).json({
        status: 'success',
        data: application,
      })
    } catch (error) {
      next(error)
    }
  }

  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { id } = req.params
      const documentData = req.body
      const document = await applicationService.uploadDocument(id, userId, documentData)
      res.status(201).json({
        status: 'success',
        data: document,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { id } = req.params
      const result = await applicationService.deleteApplication(id, userId)
      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new ApplicationController()
