import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, User, LogOut, Globe, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLanguageStore } from '../../store/languageStore'
import { useState } from 'react'

export default function Header() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              YojanaSaathi
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/schemes"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('nav.schemes')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/applications"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.applications')}
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.profile')}
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Button - Prominent */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {languages.find((l) => l.code === language)?.name}
                </span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any)
                        setShowLangMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        language === lang.code ? 'bg-primary-50 text-primary-600' : ''
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                >
                  <User className="w-5 h-5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>{t('common.logout')}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn btn-primary"
              >
                {t('common.login')}
              </Link>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
