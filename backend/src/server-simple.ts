import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000
const allowedOrigins = Array.from(
  new Set(
    [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(
      (origin): origin is string => Boolean(origin)
    )
  )
)

// Middleware
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  },
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

interface ParsedScheme {
  name: string
  category: string
  benefit: string
  description: string
}

const parseSchemesFromContext = (schemeContext: string): ParsedScheme[] => {
  if (!schemeContext.trim()) {
    return []
  }

  return schemeContext
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim())
      const firstLine = lines.find((line) => /^\d+\.\s+/.test(line)) || ''
      const name = firstLine.replace(/^\d+\.\s+/, '').trim() || 'Unnamed Scheme'
      const pick = (prefix: string) =>
        lines.find((line) => line.toLowerCase().startsWith(prefix.toLowerCase() + ':'))?.split(':').slice(1).join(':').trim() || 'N/A'

      return {
        name,
        category: pick('Category'),
        benefit: pick('Benefit'),
        description: pick('Description'),
      }
    })
}

const getLocalChatResponse = (message: string, language: string, schemeContext: string, missingApiKey: boolean): string => {
  const schemes = parseSchemesFromContext(schemeContext)
  const categories = [...new Set(schemes.map((scheme) => scheme.category).filter(Boolean))]
  const lowerMessage = message.toLowerCase()

  if (/\b(hi|hello|hey|namaste|good morning|good evening)\b/i.test(message)) {
    if (language === 'hi') {
      return missingApiKey
        ? 'Namaste! AI key configured nahi hai, lekin main local scheme data se madad kar sakta hoon. Category ya scheme name puchhiye.'
        : 'Namaste! AI service issue hai. Main local scheme data se madad kar sakta hoon. Category ya scheme name puchhiye.'
    }
    return missingApiKey
      ? 'Namaste! AI key is not configured, but I can help using local scheme data. Ask a category or scheme name.'
      : 'Namaste! AI service has an issue. I can help using local scheme data. Ask a category or scheme name.'
  }

  if (/(category|categories|type|types|list)/i.test(lowerMessage) && categories.length > 0) {
    return `Available categories:\n${categories.map((category) => `- ${category}`).join('\n')}`
  }

  const matched = schemes
    .filter((scheme) => {
      const text = `${scheme.name} ${scheme.category} ${scheme.description}`.toLowerCase()
      return lowerMessage.split(/\s+/).some((word) => word.length > 2 && text.includes(word))
    })
    .slice(0, 3)

  if (matched.length > 0) {
    return `${language === 'hi' ? 'Mujhe relevant schemes mili:' : 'I found relevant schemes:'}\n\n${matched
      .map((scheme, index) => `${index + 1}. ${scheme.name}\n   Category: ${scheme.category}\n   Benefit: ${scheme.benefit}`)
      .join('\n\n')}`
  }

  if (schemes.length > 0) {
    return `${language === 'hi' ? 'Main local data se madad kar sakta hoon. Example schemes:' : 'I can help from local data. Example schemes:'}\n${schemes
      .slice(0, 3)
      .map((scheme) => `- ${scheme.name} (${scheme.category})`)
      .join('\n')}`
  }

  return language === 'hi'
    ? 'Local scheme data available nahi hai. Kripya baad me try karein.'
    : 'Local scheme data is not available right now. Please try again later.'
}

app.post('/api/chatbot', async (req: Request, res: Response) => {
  const { message, language = 'en', schemeContext = '' } = req.body as {
    message?: string
    language?: string
    schemeContext?: string
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Message is required'
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.json({
      status: 'success',
      data: {
        response: getLocalChatResponse(message.trim(), language, schemeContext, true)
      }
    })
  }

  try {
    const response = await fetch(`${process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: 'You are YojanaSaathi AI. Help users with Indian government schemes. Be concise and practical.'
            }
          ]
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Language: ${language}\n\nAvailable schemes:\n${schemeContext || 'Not provided'}\n\nUser question: ${message.trim()}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          topP: 0.7,
          maxOutputTokens: 1024
        }
      })
    })

    if (!response.ok) {
      return res.json({
        status: 'success',
        data: {
          response: getLocalChatResponse(message.trim(), language, schemeContext, false)
        }
      })
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }

    return res.json({
      status: 'success',
      data: {
        response:
          data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || '')
            .join('')
            .trim() || 'No response from AI service.'
      }
    })
  } catch {
    return res.json({
      status: 'success',
      data: {
        response: getLocalChatResponse(message.trim(), language, schemeContext, false)
      }
    })
  }
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
