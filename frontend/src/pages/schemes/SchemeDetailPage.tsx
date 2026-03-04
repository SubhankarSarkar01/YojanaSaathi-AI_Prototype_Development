import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'

export default function SchemeDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/schemes" className="flex items-center text-primary-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('common.back')}
      </Link>

      <div className="card mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="badge badge-success mb-2">Active</span>
            <h1 className="text-3xl font-bold">Pradhan Mantri Kisan Samman Nidhi</h1>
            <p className="text-gray-600 mt-2">Ministry of Agriculture & Farmers Welfare</p>
          </div>
          <span className="text-4xl">🌾</span>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Your Match Score</span>
            <span className="text-2xl font-bold text-primary-600">85%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('schemes.benefits')}
            </h2>
            <p className="text-gray-700">
              Financial assistance of ₹6,000 per year in three equal installments to all landholding farmer families.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {t('schemes.eligibility')}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Must be a farmer with cultivable land</li>
              <li>Land ownership records required</li>
              <li>Aadhaar card mandatory</li>
              <li>Bank account linked with Aadhaar</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">{t('schemes.documents')}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Income Certificate'].map((doc) => (
                <div key={doc} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link to={`/applications/new/${id}`} className="btn btn-primary flex-1">
            {t('schemes.applyNow')}
          </Link>
          <button className="btn btn-outline">
            Save for Later
          </button>
        </div>
      </div>
    </div>
  )
}
