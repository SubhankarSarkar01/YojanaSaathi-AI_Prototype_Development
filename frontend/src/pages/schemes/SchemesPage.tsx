import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Calendar, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { toast } from 'sonner'
import VoiceSearch from '../../components/common/VoiceSearch'

interface Scheme {
  scheme_id: string
  scheme_code: string
  name_en: string
  name_hi: string
  description_en: string
  description_hi: string
  category: string
  level: string
  department: string
  benefit_amount: string
  deadline: string | null
  is_ongoing: boolean
}

export default function SchemesPage() {
  const { i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/schemes')
      if (response.data.status === 'success') {
        setSchemes(response.data.data)
        setFilteredSchemes(response.data.data)
      }
    } catch (error: any) {
      toast.error('Failed to load schemes')
      console.error('Error fetching schemes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceResult = (text: string) => {
    setSearchQuery(text)
    // Automatically search after voice input
    setTimeout(() => {
      performSearch(text)
    }, 100)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Agriculture: 'text-blue-600 bg-blue-50',
      Education: 'text-purple-600 bg-purple-50',
      Healthcare: 'text-red-600 bg-red-50',
      Housing: 'text-orange-600 bg-orange-50',
      Employment: 'text-indigo-600 bg-indigo-50',
    }
    return colors[category] || 'text-gray-600 bg-gray-50'
  }

  const formatBenefit = (amount: string) => {
    const num = parseFloat(amount)
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} lakh`
    }
    return `₹${num.toLocaleString('en-IN')}`
  }

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSchemes(schemes)
      return
    }

    const filtered = schemes.filter((scheme) => {
      const name = i18n.language === 'hi' ? scheme.name_hi : scheme.name_en
      const description = i18n.language === 'hi' ? scheme.description_hi : scheme.description_en
      const searchTerm = query.toLowerCase()
      
      return (
        name?.toLowerCase().includes(searchTerm) ||
        scheme.category.toLowerCase().includes(searchTerm) ||
        description?.toLowerCase().includes(searchTerm) ||
        scheme.department.toLowerCase().includes(searchTerm)
      )
    })
    setFilteredSchemes(filtered)
  }

  const handleSearch = () => {
    performSearch(searchQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schemes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Search Government Schemes
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Find the right schemes by searching via keywords like "Agriculture", "Student", or "Pension".
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={i18n.language === 'hi' 
                  ? 'नाम या श्रेणी से योजनाएं खोजें...' 
                  : 'Search schemes by name or category...'}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
            <VoiceSearch 
              onResult={handleVoiceResult}
              language={i18n.language}
              className="px-4 py-4 rounded-lg"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {i18n.language === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {i18n.language === 'hi' 
              ? '🎤 माइक बटन दबाएं और अपनी भाषा में बोलें' 
              : '🎤 Click the mic button and speak in your language'}
          </p>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 text-lg">
          Found <span className="font-semibold text-gray-900">{filteredSchemes.length}</span> schemes
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const name = i18n.language === 'hi' ? scheme.name_hi : scheme.name_en
          const description = i18n.language === 'hi' ? scheme.description_hi : scheme.description_en
          
          return (
            <div
              key={scheme.scheme_id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
            >
              {/* Category and Deadline */}
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(scheme.category)}`}>
                  <Tag className="w-4 h-4 mr-1" />
                  {scheme.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'Ongoing'}
                </span>
              </div>

              {/* Scheme Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {description}
              </p>

              {/* Benefits */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Benefits:</p>
                <p className="text-sm font-medium text-green-600">
                  {formatBenefit(scheme.benefit_amount)}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  Level: <span className="font-semibold">{scheme.level}</span>
                </span>
                <Link
                  to={`/schemes/${scheme.scheme_id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center"
                >
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {filteredSchemes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No schemes found
          </h3>
          <p className="text-gray-600">
            Try searching with different keywords
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilteredSchemes(schemes)
            }}
            className="mt-4 text-primary-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
