import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

interface Scheme {
  scheme_id: string
  name_en: string
  name_hi: string
  description_en: string
  category: string
  benefit_amount: string
}

export default function NewApplicationPage() {
  const { schemeId } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated } = useAuthStore()
  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for schemes')
      navigate('/auth')
      return
    }
    fetchScheme()
  }, [schemeId, isAuthenticated])

  const fetchScheme = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/schemes/${schemeId}`)
      if (response.data.status === 'success') {
        setScheme(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load scheme details')
      navigate('/schemes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.userId) {
      toast.error('Please login to apply')
      navigate('/auth')
      return
    }

    setSubmitting(true)

    try {
      const response = await apiClient.post('/applications', {
        schemeId: schemeId,
      })

      if (response.data.status === 'success') {
        toast.success('Application submitted successfully!')
        navigate('/applications')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to submit application'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scheme details...</p>
        </div>
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Scheme not found</h2>
        <Link to="/schemes" className="text-primary-600 hover:underline">
          Back to schemes
        </Link>
      </div>
    )
  }

  const schemeName = i18n.language === 'hi' ? scheme.name_hi : scheme.name_en

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/schemes" className="flex items-center text-primary-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Schemes
      </Link>

      <div className="card mb-6">
        <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-6">
          <div className="flex items-start">
            <FileText className="w-6 h-6 text-primary-600 mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Apply for Scheme</h2>
              <p className="text-gray-700 font-medium">{schemeName}</p>
              <p className="text-sm text-gray-600 mt-1">Category: {scheme.category}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Application Information
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Applicant:</strong> {user?.fullName || user?.email}</p>
              <p><strong>Scheme:</strong> {schemeName}</p>
              <p><strong>Benefit Amount:</strong> ₹{parseFloat(scheme.benefit_amount).toLocaleString('en-IN')}</p>
              <p><strong>Status:</strong> Draft (will be submitted)</p>
            </div>
          </div>

          {/* Required Documents Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Required Documents
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                You will need to upload the following documents after submitting this application:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                  Aadhaar Card
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                  Income Certificate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                  Address Proof
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                  Bank Account Details
                </li>
              </ul>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Important Notes</h3>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Ensure all information provided is accurate</li>
              <li>• You can upload documents after submitting the application</li>
              <li>• Application will be reviewed by the concerned department</li>
              <li>• You will be notified about the application status</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <Link to="/schemes" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
