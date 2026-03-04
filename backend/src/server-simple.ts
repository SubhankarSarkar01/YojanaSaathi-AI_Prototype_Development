import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running!'
  })
})

// Mock schemes data
const mockSchemes = [
  {
    scheme_id: '1',
    scheme_code: 'PM-KISAN',
    name_en: 'PM-KISAN Samman Nidhi',
    name_hi: 'पीएम-किसान सम्मान निधि',
    description_en: 'Direct income support of ₹6000 per year to small and marginal farmers',
    category: 'Agriculture',
    level: 'Central',
    benefit_amount: 6000,
    is_ongoing: true
  },
  {
    scheme_id: '2',
    scheme_code: 'POST-MATRIC',
    name_en: 'Post Matric Scholarship for SC Students',
    name_hi: 'एससी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
    description_en: 'Financial assistance for SC students pursuing higher education',
    category: 'Education',
    level: 'Central',
    benefit_amount: 50000,
    is_ongoing: true
  },
  {
    scheme_id: '3',
    scheme_code: 'AYUSHMAN',
    name_en: 'Ayushman Bharat - PM-JAY',
    name_hi: 'आयुष्मान भारत - पीएम-जेएवाई',
    description_en: 'Health insurance coverage of ₹5 lakh per family per year',
    category: 'Healthcare',
    level: 'Central',
    benefit_amount: 500000,
    is_ongoing: true
  },
  {
    scheme_id: '4',
    scheme_code: 'PM-AWAS',
    name_en: 'Pradhan Mantri Awas Yojana',
    name_hi: 'प्रधानमंत्री आवास योजना',
    description_en: 'Housing for all with financial assistance for construction',
    category: 'Housing',
    level: 'Central',
    benefit_amount: 120000,
    is_ongoing: true
  },
  {
    scheme_id: '5',
    scheme_code: 'MGNREGA',
    name_en: 'Mahatma Gandhi NREGA',
    name_hi: 'महात्मा गांधी नरेगा',
    description_en: '100 days of guaranteed wage employment in rural areas',
    category: 'Employment',
    level: 'Central',
    benefit_amount: 20000,
    is_ongoing: true
  }
]

// API Routes
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, search } = req.query
  
  let schemes = [...mockSchemes]
  
  if (category) {
    schemes = schemes.filter(s => s.category === category)
  }
  
  if (search) {
    const searchLower = (search as string).toLowerCase()
    schemes = schemes.filter(s => 
      s.name_en.toLowerCase().includes(searchLower) ||
      s.description_en.toLowerCase().includes(searchLower)
    )
  }
  
  res.json({
    status: 'success',
    data: schemes
  })
})

app.get('/api/schemes/:id', (req: Request, res: Response) => {
  const scheme = mockSchemes.find(s => s.scheme_id === req.params.id)
  
  if (!scheme) {
    return res.status(404).json({
      status: 'error',
      message: 'Scheme not found'
    })
  }
  
  res.json({
    status: 'success',
    data: scheme
  })
})

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, password } = req.body
  
  if (!fullName || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    })
  }
  
  res.json({
    status: 'success',
    data: {
      user: {
        userId: 'mock-user-id',
        email,
        fullName
      },
      token: 'mock-jwt-token'
    }
  })
})

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { emailOrMobile, password } = req.body
  
  if (!emailOrMobile || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    })
  }
  
  res.json({
    status: 'success',
    data: {
      user: {
        userId: 'mock-user-id',
        email: emailOrMobile,
        fullName: 'Test User'
      },
      token: 'mock-jwt-token'
    }
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found' 
  })
})

// Start server
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 YojanaSaathi Backend is running!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Server: http://localhost:${PORT}`)
  console.log(`🔍 Health: http://localhost:${PORT}/health`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Backend is ready! No database required.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

export default app
