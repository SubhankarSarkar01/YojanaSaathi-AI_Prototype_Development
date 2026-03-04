import { AppDataSource } from '../config/database'
import { Profile } from '../models/Profile'
import { User } from '../models/User'
import { AppError } from '../middleware/error.middleware'

export class ProfileService {
  calculateCompleteness(profile: Partial<Profile>): number {
    const fields = [
      'date_of_birth',
      'gender',
      'state',
      'district',
      'pin_code',
      'category',
      'occupation',
      'annual_income',
      'family_size',
      'education_qualification',
    ]

    const filledFields = fields.filter((field) => profile[field as keyof Profile] != null)
    return Math.round((filledFields.length / fields.length) * 100)
  }

  async createProfile(userId: string, data: Partial<Profile>) {
    const profileRepo = AppDataSource.getRepository(Profile)
    const userRepo = AppDataSource.getRepository(User)

    // Check if user exists
    const user = await userRepo.findOne({ where: { user_id: userId } })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Check if profile already exists
    const existingProfile = await profileRepo.findOne({ where: { user_id: userId } })
    if (existingProfile) {
      throw new AppError('Profile already exists', 409)
    }

    // Calculate completeness
    const completeness = this.calculateCompleteness(data)

    // Create profile
    const profile = profileRepo.create({
      ...data,
      user_id: userId,
      profile_completeness: completeness,
    })

    await profileRepo.save(profile)
    return profile
  }

  async getProfile(userId: string) {
    const profileRepo = AppDataSource.getRepository(Profile)
    const profile = await profileRepo.findOne({ where: { user_id: userId } })

    if (!profile) {
      throw new AppError('Profile not found', 404)
    }

    return profile
  }

  async updateProfile(userId: string, data: Partial<Profile>) {
    const profileRepo = AppDataSource.getRepository(Profile)
    const profile = await profileRepo.findOne({ where: { user_id: userId } })

    if (!profile) {
      throw new AppError('Profile not found', 404)
    }

    // Update fields
    Object.assign(profile, data)

    // Recalculate completeness
    profile.profile_completeness = this.calculateCompleteness(profile)

    await profileRepo.save(profile)
    return profile
  }

  async deleteProfile(userId: string) {
    const profileRepo = AppDataSource.getRepository(Profile)
    const profile = await profileRepo.findOne({ where: { user_id: userId } })

    if (!profile) {
      throw new AppError('Profile not found', 404)
    }

    await profileRepo.remove(profile)
    return { message: 'Profile deleted successfully' }
  }
}

export default new ProfileService()
