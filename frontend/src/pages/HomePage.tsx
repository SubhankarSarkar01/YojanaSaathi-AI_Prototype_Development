import { useTranslation } from 'react-i18next'
import { Search, TrendingUp, Sparkles, FileText, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export default function HomePage() {
  const { t } = useTranslation()
  const [schemes, setSchemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fetch real schemes from database
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await apiClient.get('/schemes')
        if (response.data.status === 'success') {
          // Get first 6 schemes for trending section
          setSchemes(response.data.data.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching schemes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (schemes.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(schemes.length / 3))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [schemes.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(schemes.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(schemes.length / 3)) % Math.ceil(schemes.length / 3))
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Agriculture': '🌾',
      'Education': '📚',
      'Healthcare': '🏥',
      'Health': '🏥',
      'Employment': '💼',
      'Housing': '🏠',
      'Social Welfare': '🤝',
    }
    return icons[category] || '📋'
  }

  const categories = [
    { id: 'agriculture', name: t('schemes.category.agriculture'), icon: '🌾', color: 'bg-green-100 text-green-700' },
    { id: 'education', name: t('schemes.category.education'), icon: '📚', color: 'bg-blue-100 text-blue-700' },
    { id: 'health', name: t('schemes.category.health'), icon: '🏥', color: 'bg-red-100 text-red-700' },
    { id: 'employment', name: t('schemes.category.employment'), icon: '💼', color: 'bg-purple-100 text-purple-700' },
    { id: 'housing', name: t('schemes.category.housing'), icon: '🏠', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'socialWelfare', name: t('schemes.category.socialWelfare'), icon: '🤝', color: 'bg-pink-100 text-pink-700' },
  ]

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized scheme suggestions based on your profile'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Smart Document Processing',
      description: 'OCR technology extracts data from your documents automatically'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Fraud Detection',
      description: 'Advanced AI prevents duplicate and fraudulent applications'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Tracking',
      description: 'Track your application status with instant notifications'
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Search Government Schemes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find the right schemes by searching via keywords like "Agriculture", "Student", or "Pension".
        </p>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schemes by name or category..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = '/schemes'
                  }
                }}
              />
            </div>
            <Link
              to="/schemes"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Search
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/schemes" className="btn btn-primary text-lg px-8 py-3">
            Browse All Schemes
          </Link>
          <Link to="/profile/create" className="btn btn-outline text-lg px-8 py-3">
            Create Profile
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('home.categories')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/schemes?category=${category.id}`}
              className="card hover:shadow-lg transition-shadow text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${category.color} flex items-center justify-center text-3xl`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 -mx-4 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose YojanaSaathi?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Schemes - Sliding Carousel */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            {t('home.trendingSchemes')}
          </h2>
          <Link to="/schemes" className="text-primary-600 hover:underline font-semibold">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : schemes.length > 0 ? (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Group schemes in sets of 3 */}
                {Array.from({ length: Math.ceil(schemes.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                    {schemes.slice(slideIndex * 3, slideIndex * 3 + 3).map((scheme) => (
                      <div key={scheme.scheme_id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="badge badge-success mb-2">
                              {scheme.is_ongoing ? 'Active' : 'Inactive'}
                            </span>
                            <h3 className="text-xl font-semibold line-clamp-2">
                              {scheme.name_en}
                            </h3>
                          </div>
                          <span className="text-3xl">{getCategoryIcon(scheme.category)}</span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {scheme.description_en}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Category:</span>
                            <span className="font-medium">{scheme.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Benefit:</span>
                            <span className="font-semibold text-green-600">
                              ₹{parseFloat(scheme.benefit_amount).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Level:</span>
                            <span className="font-medium">{scheme.level}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/schemes/${scheme.scheme_id}`} 
                          className="text-primary-600 hover:underline font-medium"
                        >
                          {t('common.viewDetails')} →
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {schemes.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {schemes.length > 3 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(schemes.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'bg-primary-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No schemes available at the moment.</p>
            <Link to="/schemes" className="text-primary-600 hover:underline mt-2 inline-block">
              Browse all schemes
            </Link>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="bg-primary-600 text-white -mx-4 px-4 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Government Schemes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-primary-100">Applications Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-primary-100">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
