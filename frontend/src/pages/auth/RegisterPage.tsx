import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile')
  const [name, setName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile)
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (loginMethod === 'mobile') {
      if (!validateMobile(mobileNumber)) {
        toast.error('Please enter a valid 10-digit mobile number')
        return
      }
    } else {
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address')
        return
      }
    }

    setLoading(true)
    
    try {
      const response = await apiClient.post('/auth/register', {
        fullName: name,
        password: password,
        email: loginMethod === 'email' ? email : undefined,
        mobileNumber: loginMethod === 'mobile' ? mobileNumber : undefined,
      })
      
      if (response.data.status === 'success') {
        const { user, token } = response.data.data
        login(user, token)
        toast.success('Registration successful!')
        navigate('/profile/create')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-center mb-6">
        {t('auth.registerTitle')}
      </h2>
      
      {/* Login Method Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setLoginMethod('mobile')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            loginMethod === 'mobile'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Phone className="w-4 h-4 inline mr-2" />
          Mobile
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            loginMethod === 'email'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </button>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="input pl-10"
              required
            />
          </div>
        </div>

        {/* Mobile or Email Field */}
        {loginMethod === 'mobile' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.mobileNumber')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={t('auth.enterMobile')}
                className="input pl-10"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input pl-10"
                required
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 characters)"
              className="input pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? t('common.loading') : t('common.register')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:underline">
          {t('common.login')}
        </Link>
      </div>
    </div>
  )
}
