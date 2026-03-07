import { NextFunction, Request, Response } from 'express'
import { AppError } from '../middleware/error.middleware'
import chatbotService from '../services/chatbot.service'

export class ChatbotController {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, language = 'en', schemeContext = '' } = req.body as {
        message?: string
        language?: string
        schemeContext?: string
      }

      if (!message || typeof message !== 'string' || !message.trim()) {
        throw new AppError('Message is required', 400)
      }

      const response = await chatbotService.generateResponse({
        message: message.trim(),
        language,
        schemeContext: typeof schemeContext === 'string' ? schemeContext : '',
      })

      res.status(200).json({
        status: 'success',
        data: {
          response,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new ChatbotController()
