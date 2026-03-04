import { AppDataSource } from '../config/database'
import { In } from 'typeorm'
import { Application } from '../models/Application'
import { Document } from '../models/Document'
import { User } from '../models/User'
import { Scheme } from '../models/Scheme'
import { AppError } from '../middleware/error.middleware'

export class ApplicationService {
  calculateCompletionPercentage(application: Application): number {
    // Simple calculation based on documents uploaded
    const requiredDocuments = 5 // This should come from scheme requirements
    const uploadedDocuments = application.documents?.length || 0
    return Math.min(Math.round((uploadedDocuments / requiredDocuments) * 100), 100)
  }

  async createApplication(userId: string, schemeId: string) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const userRepo = AppDataSource.getRepository(User)
    const schemeRepo = AppDataSource.getRepository(Scheme)

    // Verify user exists
    const user = await userRepo.findOne({ where: { user_id: userId } })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Verify scheme exists
    const scheme = await schemeRepo.findOne({ where: { scheme_id: schemeId } })
    if (!scheme) {
      throw new AppError('Scheme not found', 404)
    }

    // Check for duplicate application
    const existingApplication = await applicationRepo.findOne({
      where: {
        user_id: userId,
        scheme_id: schemeId,
        status: In(['draft', 'submitted', 'under_review']),
      },
    })

    if (existingApplication) {
      throw new AppError('Application already exists for this scheme', 409)
    }

    // Create application
    const application = applicationRepo.create({
      user_id: userId,
      scheme_id: schemeId,
      status: 'draft',
      completion_percentage: 0,
    })

    await applicationRepo.save(application)
    return application
  }

  async getApplicationById(applicationId: string, userId: string) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const application = await applicationRepo.findOne({
      where: { application_id: applicationId, user_id: userId },
      relations: ['scheme', 'documents'],
    })

    if (!application) {
      throw new AppError('Application not found', 404)
    }

    return application
  }

  async getUserApplications(userId: string) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const applications = await applicationRepo.find({
      where: { user_id: userId },
      relations: ['scheme'],
      order: { created_at: 'DESC' },
    })

    return applications
  }

  async submitApplication(applicationId: string, userId: string) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const application = await applicationRepo.findOne({
      where: { application_id: applicationId, user_id: userId },
      relations: ['documents'],
    })

    if (!application) {
      throw new AppError('Application not found', 404)
    }

    if (application.status !== 'draft') {
      throw new AppError('Application has already been submitted', 400)
    }

    // Check if application is complete
    const completionPercentage = this.calculateCompletionPercentage(application)
    if (completionPercentage < 100) {
      throw new AppError('Application is incomplete. Please upload all required documents', 400)
    }

    // Update application status
    application.status = 'submitted'
    application.submitted_at = new Date()
    application.completion_percentage = completionPercentage

    await applicationRepo.save(application)
    return application
  }

  async uploadDocument(
    applicationId: string,
    userId: string,
    documentData: {
      documentType: string
      filePath: string
      ocrData?: Record<string, any>
    }
  ) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const documentRepo = AppDataSource.getRepository(Document)

    // Verify application exists and belongs to user
    const application = await applicationRepo.findOne({
      where: { application_id: applicationId, user_id: userId },
      relations: ['documents'],
    })

    if (!application) {
      throw new AppError('Application not found', 404)
    }

    // Create document
    const document = documentRepo.create({
      application_id: applicationId,
      document_type: documentData.documentType,
      file_path: documentData.filePath,
      ocr_data: documentData.ocrData,
      is_verified: false,
    })

    await documentRepo.save(document)

    // Update application completion percentage
    application.completion_percentage = this.calculateCompletionPercentage(application)
    await applicationRepo.save(application)

    return document
  }

  async deleteApplication(applicationId: string, userId: string) {
    const applicationRepo = AppDataSource.getRepository(Application)
    const application = await applicationRepo.findOne({
      where: { application_id: applicationId, user_id: userId },
    })

    if (!application) {
      throw new AppError('Application not found', 404)
    }

    if (application.status !== 'draft') {
      throw new AppError('Cannot delete submitted application', 400)
    }

    await applicationRepo.remove(application)
    return { message: 'Application deleted successfully' }
  }
}

export default new ApplicationService()
