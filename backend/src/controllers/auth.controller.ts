import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json({
        status: 'success',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body)
      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.emailOrMobile)
      res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body)
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const user = await authService.getUserById(userId)
      res.status(200).json({
        status: 'success',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
