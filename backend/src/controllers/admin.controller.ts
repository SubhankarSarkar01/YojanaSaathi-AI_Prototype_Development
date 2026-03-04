import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/database'
import { Scheme } from '../models/Scheme'
import { Application } from '../models/Application'
import { User } from '../models/User'
import { AppError } from '../middleware/error.middleware'

export class AdminController {
  // Get all schemes
  async getAllSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const schemeRepo = AppDataSource.getRepository(Scheme)
      const schemes = await schemeRepo.find({
        order: { created_at: 'DESC' },
      })

      res.status(200).json({
        status: 'success',
        data: schemes,
      })
    } catch (error) {
      next(error)
    }
  }

  // Create new scheme
  async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const schemeRepo = AppDataSource.getRepository(Scheme)
      
      const scheme = schemeRepo.create({
        scheme_code: req.body.schemeCode,
        name_en: req.body.nameEn,
        name_hi: req.body.nameHi || req.body.nameEn,
        name_ta: req.body.nameTa || req.body.nameEn,
        name_te: req.body.nameTe || req.body.nameEn,
        name_bn: req.body.nameBn || req.body.nameEn,
        description_en: req.body.descriptionEn,
        description_hi: req.body.descriptionHi || req.body.descriptionEn,
        category: req.body.category,
        level: req.body.level,
        department: req.body.department,
        benefit_amount: req.body.benefitAmount,
        deadline: req.body.deadline || null,
        is_ongoing: req.body.isOngoing !== false,
      })

      await schemeRepo.save(scheme)

      res.status(201).json({
        status: 'success',
        data: scheme,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update scheme
  async updateScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const schemeRepo = AppDataSource.getRepository(Scheme)
      
      const scheme = await schemeRepo.findOne({ where: { scheme_id: id } })
      if (!scheme) {
        throw new AppError('Scheme not found', 404)
      }

      Object.assign(scheme, {
        scheme_code: req.body.schemeCode || scheme.scheme_code,
        name_en: req.body.nameEn || scheme.name_en,
        name_hi: req.body.nameHi || scheme.name_hi,
        description_en: req.body.descriptionEn || scheme.description_en,
        description_hi: req.body.descriptionHi || scheme.description_hi,
        category: req.body.category || scheme.category,
        level: req.body.level || scheme.level,
        department: req.body.department || scheme.department,
        benefit_amount: req.body.benefitAmount || scheme.benefit_amount,
        deadline: req.body.deadline !== undefined ? req.body.deadline : scheme.deadline,
        is_ongoing: req.body.isOngoing !== undefined ? req.body.isOngoing : scheme.is_ongoing,
      })

      await schemeRepo.save(scheme)

      res.status(200).json({
        status: 'success',
        data: scheme,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete scheme
  async deleteScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const schemeRepo = AppDataSource.getRepository(Scheme)
      
      const scheme = await schemeRepo.findOne({ where: { scheme_id: id } })
      if (!scheme) {
        throw new AppError('Scheme not found', 404)
      }

      await schemeRepo.remove(scheme)

      res.status(200).json({
        status: 'success',
        message: 'Scheme deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all applications
  async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationRepo = AppDataSource.getRepository(Application)
      const applications = await applicationRepo.find({
        relations: ['user', 'scheme'],
        order: { created_at: 'DESC' },
      })

      res.status(200).json({
        status: 'success',
        data: applications,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepo = AppDataSource.getRepository(User)
      const users = await userRepo.find({
        select: ['user_id', 'email', 'full_name', 'mobile_number', 'role', 'created_at'],
        order: { created_at: 'DESC' },
      })

      res.status(200).json({
        status: 'success',
        data: users,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get dashboard stats
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const schemeRepo = AppDataSource.getRepository(Scheme)
      const applicationRepo = AppDataSource.getRepository(Application)
      const userRepo = AppDataSource.getRepository(User)

      const [totalSchemes, totalApplications, totalUsers] = await Promise.all([
        schemeRepo.count(),
        applicationRepo.count(),
        userRepo.count({ where: { role: 'user' } }),
      ])

      const applicationsByStatus = await applicationRepo
        .createQueryBuilder('application')
        .select('application.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('application.status')
        .getRawMany()

      res.status(200).json({
        status: 'success',
        data: {
          totalSchemes,
          totalApplications,
          totalUsers,
          applicationsByStatus,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AdminController()
