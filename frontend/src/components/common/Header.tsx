import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, User, LogOut, Globe, Shield, Search } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLanguageStore } from '../../store/languageStore'
import { useState } from 'react'
import AuthModal from '../auth/AuthModal'

export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

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
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              YojanaSaathi
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/schemes"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {t('nav.schemes')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/applications"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {t('nav.applications')}
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {t('nav.profile')}
                </Link>
              </>
            )}
          </nav>

          {/* Search Bar - Center */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search') || 'Search schemes...'}
                className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg font-medium transition-colors flex items-center space-x-1"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
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
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden lg:inline font-medium">
                  {languages.find((l) => l.code === language)?.name}
                </span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
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

            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <>
                {/* Admin Button */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAuthMode('login')
                    setShowAuthModal(true)
                  }}
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {t('common.login')}
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register')
                    setShowAuthModal(true)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t('common.register') || 'Register'}
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </header>
  )
}
