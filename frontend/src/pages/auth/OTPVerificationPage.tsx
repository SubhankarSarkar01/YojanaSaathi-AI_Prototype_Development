import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/authStore'

export default function OTPVerificationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login: setAuth } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)

  const { loginMethod, mobileNumber, email, name, isRegistration } = location.state || {}
  const displayContact = loginMethod === 'mobile' ? mobileNumber : email

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    setLoading(true)

    try {
      // TODO: Call API to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data
      const user = {
        userId: '123',
        mobileNumber: mobileNumber || '',
        email: email || '',
        name: name || 'User'
      }
      const token = 'mock-jwt-token'

      setAuth(user, token)

      if (isRegistration) {
        toast.success('Registration successful! Welcome to YojanaSaathi')
      } else {
        toast.success(t('auth.loginSuccess'))
      }

      navigate('/')
    } catch (error) {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      // TODO: Call API to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('OTP resent successfully')
      setOtp(['', '', '', '', '', ''])
    } catch (error) {
      toast.error('Failed to resend OTP')
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-center mb-2">
        {t('auth.verifyOTP')}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the OTP sent to {displayContact}
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              maxLength={1}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? t('common.loading') : t('auth.verifyOTP')}
        </button>

        <button
          type="button"
          onClick={handleResendOTP}
          className="w-full text-center text-primary-600 hover:underline"
        >
          {t('auth.resendOTP')}
        </button>
      </form>
    </div>
  )
}
