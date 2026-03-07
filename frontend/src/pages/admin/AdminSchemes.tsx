import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { toast } from 'sonner'

interface Scheme {
  scheme_id: string
  scheme_code: string
  name_en: string
  description_en: string
  category: string
  level: string
  department: string
  benefit_amount: string
  is_ongoing: boolean
}

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null)
  const [formData, setFormData] = useState({
    schemeCode: '',
    nameEn: '',
    nameHi: '',
    descriptionEn: '',
    descriptionHi: '',
    category: '',
    level: 'Central',
    department: '',
    benefitAmount: '',
    isOngoing: true,
  })

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/schemes')
      if (response.data.status === 'success') {
        setSchemes(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load schemes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingScheme) {
        // Update existing scheme
        await apiClient.put(`/admin/schemes/${editingScheme.scheme_id}`, formData)
        toast.success('Scheme updated successfully')
      } else {
        // Create new scheme
        await apiClient.post('/admin/schemes', formData)
        toast.success('Scheme created successfully')
      }

      setShowAddModal(false)
      setEditingScheme(null)
      resetForm()
      fetchSchemes()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save scheme')
    }
  }

  const handleDelete = async (schemeId: string) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return

    try {
      await apiClient.delete(`/admin/schemes/${schemeId}`)
      toast.success('Scheme deleted successfully')
      fetchSchemes()
    } catch (error) {
      toast.error('Failed to delete scheme')
    }
  }

  const handleEdit = (scheme: Scheme) => {
    setEditingScheme(scheme)
    setFormData({
      schemeCode: scheme.scheme_code,
      nameEn: scheme.name_en,
      nameHi: scheme.name_en, // Default to English if Hindi not available
      descriptionEn: scheme.description_en,
      descriptionHi: scheme.description_en,
      category: scheme.category,
      level: scheme.level,
      department: scheme.department,
      benefitAmount: scheme.benefit_amount,
      isOngoing: scheme.is_ongoing,
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      schemeCode: '',
      nameEn: '',
      nameHi: '',
      descriptionEn: '',
      descriptionHi: '',
      category: '',
      level: 'Central',
      department: '',
      benefitAmount: '',
      isOngoing: true,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Schemes</h1>
        <button
          onClick={() => {
            setEditingScheme(null)
            resetForm()
            setShowAddModal(true)
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Scheme
        </button>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div key={scheme.scheme_id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{scheme.name_en}</h3>
                  <span className="badge badge-info">{scheme.category}</span>
                  {scheme.is_ongoing && <span className="badge badge-success">Active</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{scheme.description_en}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Code: {scheme.scheme_code}</span>
                  <span>Level: {scheme.level}</span>
                  <span>Department: {scheme.department}</span>
                  <span>Benefit: ₹{parseFloat(scheme.benefit_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(scheme)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(scheme.scheme_id)}
                  className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Scheme Code *</label>
                  <input
                    type="text"
                    value={formData.schemeCode}
                    onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Housing">Housing</option>
                    <option value="Employment">Employment</option>
                    <option value="Social Welfare">Social Welfare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scheme Name (English) *</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scheme Name (Hindi)</label>
                <input
                  type="text"
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (English) *</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="input"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Hindi)</label>
                <textarea
                  value={formData.descriptionHi}
                  onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="Central">Central</option>
                    <option value="State">State</option>
                    <option value="District">District</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Benefit Amount (₹) *</label>
                  <input
                    type="number"
                    value={formData.benefitAmount}
                    onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input"
                  placeholder="e.g., Ministry of Agriculture"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOngoing"
                  checked={formData.isOngoing}
                  onChange={(e) => setFormData({ ...formData, isOngoing: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isOngoing" className="text-sm font-medium">
                  Scheme is currently active/ongoing
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingScheme(null)
                    resetForm()
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
