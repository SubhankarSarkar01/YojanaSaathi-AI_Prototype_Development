import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit, User, MapPin, Briefcase, Users, FileText, Download } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'sonner'

interface Profile {
  profile_id: string
  user_id: string
  date_of_birth: string | null
  gender: string | null
  state: string | null
  district: string | null
  pin_code: string | null
  category: string | null
  occupation: string | null
  annual_income: number | null
  family_size: number | null
  education_qualification: string | null
  profile_completeness: number
  aadhaar_document?: string | null
  pan_document?: string | null
  voter_card_document?: string | null
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/profile')
      if (response.data.status === 'success') {
        setProfile(response.data.data)
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile doesn't exist, redirect to create
        navigate('/profile/create')
      } else {
        toast.error('Failed to load profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = async (filename: string, documentType: string) => {
    try {
      const response = await apiClient.get(`/profile/document/${filename}`, {
        responseType: 'blob',
      })
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${documentType}_${filename}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Document downloaded successfully')
    } catch (error) {
      toast.error('Failed to download document')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No profile found</p>
        <Link to="/profile/create" className="btn btn-primary">
          Create Profile
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <Link to="/profile/edit" className="btn btn-primary">
          <Edit className="w-4 h-4 mr-2" />
          {t('profile.editProfile')}
        </Link>
      </div>

      {/* Profile Completeness */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{t('profile.completeness')}</span>
          <span className="text-primary-600 font-bold">{profile.profile_completeness}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full" 
            style={{ width: `${profile.profile_completeness}%` }}
          ></div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">{t('profile.personalInfo')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium">{user?.fullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Mobile</label>
              <p className="font-medium">{user?.mobileNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <p className="font-medium">
                {profile.date_of_birth 
                  ? new Date(profile.date_of_birth).toLocaleDateString() 
                  : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <p className="font-medium">{profile.gender || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <p className="font-medium">{profile.category || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Education</label>
              <p className="font-medium">{profile.education_qualification || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">{t('profile.location')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">State</label>
              <p className="font-medium">{profile.state || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">District</label>
              <p className="font-medium">{profile.district || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Pin Code</label>
              <p className="font-medium">{profile.pin_code || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">{t('profile.economicInfo')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Occupation</label>
              <p className="font-medium">{profile.occupation || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Annual Income</label>
              <p className="font-medium">
                {profile.annual_income 
                  ? `₹${profile.annual_income.toLocaleString('en-IN')}` 
                  : 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">{t('profile.familyDetails')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Family Size</label>
              <p className="font-medium">
                {profile.family_size 
                  ? `${profile.family_size} members` 
                  : 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        {(profile.aadhaar_document || profile.pan_document || profile.voter_card_document) && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold">Identity Documents</h2>
            </div>
            <div className="space-y-3">
              {profile.aadhaar_document && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Aadhaar Card</p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(profile.aadhaar_document!, 'aadhaar')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
              
              {profile.pan_document && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">PAN Card</p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(profile.pan_document!, 'pan')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
              
              {profile.voter_card_document && (
                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Voter ID Card</p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(profile.voter_card_document!, 'voter_card')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
