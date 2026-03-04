import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ApplicationDetailPage() {
  const { id } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/applications" className="flex items-center text-primary-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Application #{id}</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Scheme</h2>
            <p>PM Kisan Samman Nidhi</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Status</h2>
            <span className="badge badge-success">Approved</span>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              {[
                { status: 'Submitted', date: '2026-02-01', completed: true },
                { status: 'Under Review', date: '2026-02-05', completed: true },
                { status: 'Approved', date: '2026-02-10', completed: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <CheckCircle className={`w-6 h-6 ${item.completed ? 'text-green-600' : 'text-gray-300'}`} />
                  <div>
                    <p className="font-medium">{item.status}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
