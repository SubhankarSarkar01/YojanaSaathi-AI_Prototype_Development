import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import { useLanguageStore } from '../../store/languageStore'
import VoiceSearch from '../common/VoiceSearch'

interface Scheme {
  name_en: string
  category: string
  level?: string
  department?: string
  benefit_amount?: number | string | null
  description_en?: string
}

interface SchemesApiResponse {
  data?: Scheme[]
}

interface ChatbotApiResponse {
  data?: {
    response?: string
  }
  response?: string
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

const fetchRealSchemes = async (): Promise<Scheme[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schemes`)
    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as SchemesApiResponse
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching schemes:', error)
    return []
  }
}

const formatAmount = (value: number | string | null | undefined): string => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return 'Not specified'
  }
  return `Rs. ${numericValue.toLocaleString('en-IN')}`
}

const buildSchemeContext = (schemes: Scheme[]): string => {
  if (!schemes.length) {
    return ''
  }

  return schemes
    .slice(0, 20)
    .map((scheme, index) => {
      const lines = [
        `${index + 1}. ${scheme.name_en}`,
        `Category: ${scheme.category || 'N/A'}`,
        `Level: ${scheme.level || 'N/A'}`,
        `Department: ${scheme.department || 'N/A'}`,
        `Benefit: ${formatAmount(scheme.benefit_amount)}`,
      ]

      if (scheme.description_en) {
        lines.push(`Description: ${scheme.description_en.slice(0, 200)}`)
      }

      return lines.join('\n')
    })
    .join('\n\n')
}

const buildFallbackResponse = (language: string, schemes: Scheme[]): string => {
  if (schemes.length > 0) {
    const categories = [...new Set(schemes.map((scheme) => scheme.category).filter(Boolean))]
    if (language === 'hi') {
      return `AI service abhi unavailable hai, lekin hamare paas ${schemes.length} active schemes hain.\n\nCategories:\n${categories.map((category) => `- ${category}`).join('\n')}\n\nKripya specific category ya scheme ka naam poochhiye.`
    }
    return `AI service is temporarily unavailable, but we currently have ${schemes.length} active schemes.\n\nCategories:\n${categories.map((category) => `- ${category}`).join('\n')}\n\nAsk for a specific category or scheme name.`
  }

  if (language === 'hi') {
    return 'AI service se connection issue hai. Kripya thodi der baad phir try karein.'
  }
  return 'I am having trouble connecting to the AI service right now. Please try again shortly.'
}

const generateAIResponse = async (query: string, language: string): Promise<string> => {
  const schemes = await fetchRealSchemes()
  const schemeContext = buildSchemeContext(schemes)

  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: query,
        language,
        schemeContext,
      }),
    })

    if (!response.ok) {
      return buildFallbackResponse(language, schemes)
    }

    const data = (await response.json()) as ChatbotApiResponse
    const aiText = data.data?.response || data.response
    if (!aiText?.trim()) {
      return buildFallbackResponse(language, schemes)
    }

    return aiText.trim()
  } catch (error) {
    console.error('Chatbot API error:', error)
    return buildFallbackResponse(language, schemes)
  }
}

export default function ChatbotWidget() {
  const { language } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text:
        language === 'hi'
          ? 'Namaste! Main YojanaSaathi AI hoon. Main aapko sarkari yojanaon me madad kar sakta hoon.'
          : 'Namaste! I am YojanaSaathi AI. How can I help you with government schemes today?',
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!message.trim() || isTyping) {
      return
    }

    const userText = message.trim()
    setMessage('')
    setMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(userText, language)
      setMessages((prev) => [...prev, { sender: 'bot', text: aiResponse }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleVoiceResult = (text: string) => {
    setMessage(text)
    // Automatically send after voice input
    setTimeout(() => {
      if (text.trim()) {
        void handleSend()
      }
    }, 500)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        data-chatbot-trigger="true"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50 animate-pulse"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold block">YojanaSaathi AI</span>
            <span className="text-xs text-white/80">Powered by Gemini</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {item.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-4 h-4 text-orange-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                item.sender === 'user'
                  ? 'bg-green-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot className="w-4 h-4 text-orange-600" />
            </div>
            <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void handleSend()
              }
            }}
            placeholder={language === 'hi' 
              ? 'योजनाओं के बारे में पूछें...' 
              : 'Ask about schemes, eligibility...'}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-2"
          />
          <VoiceSearch 
            onResult={handleVoiceResult}
            language={language}
            className="w-9 h-9 rounded-lg"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!message.trim() || isTyping}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              message.trim() && !isTyping
                ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {language === 'hi' 
            ? '🎤 माइक से बोलें या टाइप करें • AI उत्तर सत्यापित करें' 
            : '🎤 Speak or type • AI responses should be verified'}
        </p>
      </div>
    </div>
  )
}
