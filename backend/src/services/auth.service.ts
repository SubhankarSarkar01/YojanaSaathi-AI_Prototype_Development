import { AppDataSource } from '../config/database'
import { User } from '../models/User'
import { hashPassword, comparePassword } from '../utils/encryption'
import { generateToken } from '../utils/jwt'
import { validateEmail, validatePassword } from '../utils/validation'
import { AppError } from '../middleware/error.middleware'

export class AuthService {
  async register(data: {
    email?: string
    password: string
    fullName: string
    mobileNumber?: string
  }) {
    const userRepo = AppDataSource.getRepository(User)

    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      throw new AppError('Invalid email format', 400)
    }

    // Validate password
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.message!, 400)
    }

    // Check if user already exists
    const existingUser = await userRepo.findOne({
      where: [{ email: data.email }, { mobile_number: data.mobileNumber }],
    })

    if (existingUser) {
      throw new AppError('User already exists with this email or mobile number', 409)
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = userRepo.create({
      email: data.email,
      password_hash: passwordHash,
      full_name: data.fullName,
      mobile_number: data.mobileNumber,
    })

    await userRepo.save(user)

    // Generate token
    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      mobileNumber: user.mobile_number,
      role: user.role,
    })

    return {
      user: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        mobileNumber: user.mobile_number,
        role: user.role,
      },
      token,
    }
  }

  async login(data: { emailOrMobile: string; password: string }) {
    const userRepo = AppDataSource.getRepository(User)

    // Find user by email or mobile
    const user = await userRepo.findOne({
      where: [{ email: data.emailOrMobile }, { mobile_number: data.emailOrMobile }],
    })

    if (!user || !user.password_hash) {
      throw new AppError('Invalid credentials', 401)
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password_hash)
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    // Generate token
    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      mobileNumber: user.mobile_number,
      role: user.role,
    })

    return {
      user: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        mobileNumber: user.mobile_number,
        role: user.role,
      },
      token,
    }
  }

  async getUserById(userId: string) {
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOne({ where: { user_id: userId } })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return {
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      mobileNumber: user.mobile_number,
    }
  }

  async forgotPassword(emailOrMobile: string) {
    const userRepo = AppDataSource.getRepository(User)
    
    // Find user by email or mobile
    const user = await userRepo.findOne({
      where: [{ email: emailOrMobile }, { mobile_number: emailOrMobile }],
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If the account exists, password reset instructions have been sent' }
    }

    // In a real app, you would:
    // 1. Generate a reset token
    // 2. Save it to database with expiry
    // 3. Send email/SMS with reset link
    // For now, we'll just return a simple OTP (in production, send via email/SMS)
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString()

    return {
      message: 'Password reset OTP generated',
      // In production, don't return OTP in response - send via email/SMS
      otp: resetOTP,
      userId: user.user_id,
    }
  }

  async resetPassword(data: { userId: string; newPassword: string }) {
    const userRepo = AppDataSource.getRepository(User)
    
    const user = await userRepo.findOne({ where: { user_id: data.userId } })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Validate new password
    const passwordValidation = validatePassword(data.newPassword)
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.message!, 400)
    }

    // Hash new password
    const passwordHash = await hashPassword(data.newPassword)
    user.password_hash = passwordHash
    await userRepo.save(user)

    return { message: 'Password reset successful' }
  }
}

export default new AuthService()
