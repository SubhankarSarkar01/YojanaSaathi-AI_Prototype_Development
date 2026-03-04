import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Briefcase, Users, Calendar, FileText, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api'

export default function ProfileCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    state: '',
    district: '',
    pinCode: '',
    category: '',
    occupation: '',
    annualIncome: '',
    familySize: '',
    educationQualification: '',
  })

  const [documents, setDocuments] = useState<{
    aadhaar_document: File | null
    pan_document: File | null
    voter_card_document: File | null
  }>({
    aadhaar_document: null,
    pan_document: null,
    voter_card_document: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are allowed')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setDocuments({
        ...documents,
        [documentType]: file,
      })
    }
  }

  const removeDocument = (documentType: string) => {
    setDocuments({
      ...documents,
      [documentType]: null,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Append text fields
      formDataToSend.append('date_of_birth', formData.dateOfBirth || '')
      formDataToSend.append('gender', formData.gender || '')
      formDataToSend.append('state', formData.state || '')
      formDataToSend.append('district', formData.district || '')
      formDataToSend.append('pin_code', formData.pinCode || '')
      formDataToSend.append('category', formData.category || '')
      formDataToSend.append('occupation', formData.occupation || '')
      formDataToSend.append('annual_income', formData.annualIncome || '')
      formDataToSend.append('family_size', formData.familySize || '')
      formDataToSend.append('education_qualification', formData.educationQualification || '')
      
      // Append document files
      if (documents.aadhaar_document) {
        formDataToSend.append('aadhaar_document', documents.aadhaar_document)
      }
      if (documents.pan_document) {
        formDataToSend.append('pan_document', documents.pan_document)
      }
      if (documents.voter_card_document) {
        formDataToSend.append('voter_card_document', documents.voter_card_document)
      }

      const response = await apiClient.post('/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.status === 'success') {
        toast.success('Profile created successfully!')
        navigate('/profile')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create profile'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Qualification
              </label>
              <select
                name="educationQualification"
                value={formData.educationQualification}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Education</option>
                <option value="Below 10th">Below 10th</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Location</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter your district"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Code
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter 6-digit pin code"
                maxLength={6}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Economic Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Economic Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Occupation</option>
                <option value="Farmer">Farmer</option>
                <option value="Student">Student</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Private Job">Private Job</option>
                <option value="Government Job">Government Job</option>
                <option value="Business">Business</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (₹)
              </label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder="Enter annual income"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Family Details</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Size
              </label>
              <input
                type="number"
                name="familySize"
                value={formData.familySize}
                onChange={handleChange}
                placeholder="Number of family members"
                min="1"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Identity Documents</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Upload your identity documents for verification (Optional). Accepted formats: JPG, PNG, PDF (Max 5MB each)
            </p>

            {/* Aadhaar Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Card
              </label>
              {documents.aadhaar_document ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {documents.aadhaar_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('aadhaar_document')}
                    className="p-1 hover:bg-green-100 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload Aadhaar Card</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(e, 'aadhaar_document')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* PAN Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Card
              </label>
              {documents.pan_document ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {documents.pan_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('pan_document')}
                    className="p-1 hover:bg-green-100 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload PAN Card</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(e, 'pan_document')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Voter Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voter ID Card
              </label>
              {documents.voter_card_document ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {documents.voter_card_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('voter_card_document')}
                    className="p-1 hover:bg-green-100 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload Voter ID Card</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(e, 'voter_card_document')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/schemes')}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  )
}
