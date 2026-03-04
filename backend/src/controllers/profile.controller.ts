import { Request, Response, NextFunction } from 'express'
import profileService from '../services/profile.service'
import { deleteFile } from '../utils/fileUpload'

export class ProfileController {
  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      
      // Prepare profile data with file paths
      const profileData = {
        ...req.body,
        aadhaar_document: files?.aadhaar_document?.[0]?.filename || null,
        pan_document: files?.pan_document?.[0]?.filename || null,
        voter_card_document: files?.voter_card_document?.[0]?.filename || null,
      }
      
      const profile = await profileService.createProfile(userId, profileData)
      res.status(201).json({
        status: 'success',
        data: profile,
      })
    } catch (error) {
      // Clean up uploaded files if profile creation fails
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      if (files) {
        Object.values(files).forEach(fileArray => {
          fileArray.forEach(file => deleteFile(file.filename))
        })
      }
      next(error)
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const profile = await profileService.getProfile(userId)
      res.status(200).json({
        status: 'success',
        data: profile,
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      
      // Get existing profile to delete old files if new ones are uploaded
      const existingProfile = await profileService.getProfile(userId)
      
      // Prepare update data with file paths
      const updateData = {
        ...req.body,
      }
      
      // Handle file updates
      if (files?.aadhaar_document?.[0]) {
        if (existingProfile.aadhaar_document) {
          deleteFile(existingProfile.aadhaar_document)
        }
        updateData.aadhaar_document = files.aadhaar_document[0].filename
      }
      
      if (files?.pan_document?.[0]) {
        if (existingProfile.pan_document) {
          deleteFile(existingProfile.pan_document)
        }
        updateData.pan_document = files.pan_document[0].filename
      }
      
      if (files?.voter_card_document?.[0]) {
        if (existingProfile.voter_card_document) {
          deleteFile(existingProfile.voter_card_document)
        }
        updateData.voter_card_document = files.voter_card_document[0].filename
      }
      
      const profile = await profileService.updateProfile(userId, updateData)
      res.status(200).json({
        status: 'success',
        data: profile,
      })
    } catch (error) {
      // Clean up uploaded files if update fails
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      if (files) {
        Object.values(files).forEach(fileArray => {
          fileArray.forEach(file => deleteFile(file.filename))
        })
      }
      next(error)
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const result = await profileService.deleteProfile(userId)
      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async getDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId
      const { filename } = req.params
      
      // Verify the document belongs to the user
      const profile = await profileService.getProfile(userId)
      const allowedFiles = [
        profile.aadhaar_document,
        profile.pan_document,
        profile.voter_card_document,
      ].filter(Boolean)
      
      if (!allowedFiles.includes(filename)) {
        return res.status(403).json({
          status: 'error',
          error: 'Access denied',
        })
      }
      
      const filePath = require('path').join(__dirname, '../../uploads/documents', filename)
      res.sendFile(filePath)
    } catch (error) {
      next(error)
    }
  }
}

export default new ProfileController()
