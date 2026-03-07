import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.status === 'success') {
        login(data.data.user, data.data.token)
        onClose()
        navigate('/schemes')
      } else {
        setError(data.message || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login'
              ? (i18n.language === 'hi' ? 'लॉगिन करें' : i18n.language === 'bn' ? 'লগইন করুন' : 'Login')
              : (i18n.language === 'hi' ? 'पंजीकरण करें' : i18n.language === 'bn' ? 'নিবন্ধন করুন' : 'Register')}
          </h2>
          <p className="text-gray-600">
            {mode === 'login'
              ? (i18n.language === 'hi' ? 'अपने खाते में लॉगिन करें' : i18n.language === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Login to your account')
              : (i18n.language === 'hi' ? 'नया खाता बनाएं' : i18n.language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {i18n.language === 'hi' ? 'पूरा नाम' : i18n.language === 'bn' ? 'পুরো নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {i18n.language === 'hi' ? 'ईमेल' : i18n.language === 'bn' ? 'ইমেইল' : 'Email'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {i18n.language === 'hi' ? 'मोबाइल नंबर' : i18n.language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {i18n.language === 'hi' ? 'पासवर्ड' : i18n.language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? (i18n.language === 'hi' ? 'प्रतीक्षा करें...' : i18n.language === 'bn' ? 'অপেক্ষা করুন...' : 'Please wait...')
              : mode === 'login'
                ? (i18n.language === 'hi' ? 'लॉगिन करें' : i18n.language === 'bn' ? 'লগইন করুন' : 'Login')
                : (i18n.language === 'hi' ? 'पंजीकरण करें' : i18n.language === 'bn' ? 'নিবন্ধন করুন' : 'Register')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              {i18n.language === 'hi' ? 'खाता नहीं है?' : i18n.language === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setMode('register')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {i18n.language === 'hi' ? 'पंजीकरण करें' : i18n.language === 'bn' ? 'নিবন্ধন করুন' : 'Register'}
              </button>
            </>
          ) : (
            <>
              {i18n.language === 'hi' ? 'पहले से खाता है?' : i18n.language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode('login')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {i18n.language === 'hi' ? 'लॉगिन करें' : i18n.language === 'bn' ? 'লগইন করুন' : 'Login'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
