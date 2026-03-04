import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock, Shield, LogIn, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from '../../lib/api'

type AuthMode = 'login' | 'register'

export default function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        toast.error('Please enter your full name')
        return
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }

    setLoading(true)

    try {
      if (mode === 'register') {
        // Call registration API
        const response = await apiClient.post('/auth/register', {
          fullName: fullName,
          email: email,
          password: password,
        })

        if (response.data.status === 'success') {
          const { user, token } = response.data.data
          login(user, token)
          toast.success('Registration successful! Welcome to YojanaSaathi')
          navigate('/profile/create')
        }
      } else {
        // Call login API
        const response = await apiClient.post('/auth/login', {
          emailOrMobile: email,
          password: password,
        })

        if (response.data.status === 'success') {
          const { user, token } = response.data.data
          login(user, token)
          toast.success(t('auth.loginSuccess'))
          navigate('/schemes')
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 
        (mode === 'register' ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.')
      toast.error(errorMessage)
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            Yojana Saathi AI
          </h1>
          <p className="text-gray-600">
            Citizen Authentication Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b-4 border-orange-400">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                mode === 'login'
                  ? 'text-gray-700 bg-white border-b-4 border-gray-400 -mb-1'
                  : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                mode === 'register'
                  ? 'text-green-700 bg-white border-b-4 border-green-500 -mb-1'
                  : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name - Only for Register */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  fullName
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === 'register' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Confirm Password - Only for Register */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password - Only for Login */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                mode === 'register'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                mode === 'register' ? 'Register' : 'Login'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
