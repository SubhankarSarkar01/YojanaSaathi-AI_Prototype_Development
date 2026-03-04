import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Mic, Bot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../../store/languageStore'

// Gemini API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// Fetch real schemes from database
const fetchRealSchemes = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/schemes')
    if (response.ok) {
      const data = await response.json()
      return data.data || []
    }
  } catch (error) {
    console.error('Error fetching schemes:', error)
  }
  return []
}

// Generate AI response with real scheme context
const generateAIResponse = async (query: string, language: string) => {
  // Fetch real schemes from database
  const schemes = await fetchRealSchemes()
  
  // Prepare scheme context for AI
  let schemeContext = ''
  if (schemes.length > 0) {
    schemeContext = '\n\nAvailable Government Schemes:\n'
    schemes.forEach((scheme: any, index: number) => {
      schemeContext += `\n${index + 1}. ${scheme.name_en}`
      schemeContext += `\n   - Category: ${scheme.category}`
      schemeContext += `\n   - Level: ${scheme.level}`
      schemeContext += `\n   - Department: ${scheme.department}`
      schemeContext += `\n   - Benefit: ₹${parseFloat(scheme.benefit_amount).toLocaleString('en-IN')}`
      schemeContext += `\n   - Description: ${scheme.description_en.substring(0, 150)}...`
      schemeContext += `\n`
    })
  }

  // Check if API key is available
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'DEMO') {
    return `I need a valid Gemini API key to provide intelligent responses. 

However, I can tell you that we have ${schemes.length} active schemes available:
${schemes.slice(0, 3).map((s: any) => `• ${s.name_en} (${s.category})`).join('\n')}

Please add a valid API key to get AI-powered assistance.`
  }

  try {
    // Create enhanced prompt with scheme context
    const enhancedPrompt = `You are YojanaSaathi AI, a helpful, empathetic assistant for Indian citizens seeking information about government welfare schemes.

${schemeContext}

User Question: ${query}

Instructions:
- Answer the user's question using the scheme information provided above
- Be concise, helpful, and empathetic
- If asked about a specific scheme, provide details from the list
- If asked about categories, list the available categories
- If asked about eligibility or application, provide general guidance
- Respond in ${language === 'hi' ? 'Hindi' : 'English'} if appropriate
- Keep formatting simple and clean
- Always be encouraging and supportive

Answer:`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: enhancedPrompt }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API Error:', response.status, errorData)
      
      // Fallback response with scheme data
      if (schemes.length > 0) {
        const lowerQuery = query.toLowerCase()
        const relevantSchemes = schemes.filter((s: any) => 
          s.name_en.toLowerCase().includes(lowerQuery) ||
          s.category.toLowerCase().includes(lowerQuery) ||
          s.description_en.toLowerCase().includes(lowerQuery)
        )
        
        if (relevantSchemes.length > 0) {
          let fallback = `I found ${relevantSchemes.length} relevant scheme(s):\n\n`
          relevantSchemes.slice(0, 2).forEach((s: any, i: number) => {
            fallback += `${i + 1}. **${s.name_en}**\n`
            fallback += `   Category: ${s.category} | Benefit: ₹${parseFloat(s.benefit_amount).toLocaleString('en-IN')}\n`
            fallback += `   ${s.description_en.substring(0, 100)}...\n\n`
          })
          return fallback
        }
      }
      
      throw new Error('API request failed')
    }
    
    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (aiResponse) {
      return aiResponse
    }
    
    throw new Error('No response from AI')
    
  } catch (error) {
    console.error("AI Error:", error)
    
    // Fallback: Show available schemes
    if (schemes.length > 0) {
      const categories = [...new Set(schemes.map((s: any) => s.category))]
      return `I'm having trouble connecting to the AI service right now, but I can help you with our ${schemes.length} available schemes across these categories:\n\n${categories.map(c => `• ${c}`).join('\n')}\n\nPlease ask me about a specific category or scheme!`
    }
    
    return "I'm having trouble connecting right now. Please check your internet connection and try again, or visit the Schemes page to browse available options."
  }
}

export default function ChatbotWidget() {
  const { t, i18n } = useTranslation()
  const { language } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { 
      sender: 'bot', 
      text: language === 'hi' 
        ? 'नमस्ते! मैं योजनासाथी हूँ। मैं आपकी सरकारी योजनाओं में कैसे मदद कर सकता हूँ?' 
        : 'Namaste! I am YojanaSaathi AI. How can I help you with government schemes today?' 
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    if (!message.trim() || isTyping) return

    const userText = message
    setMessage('')
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setIsTyping(true)

    const aiResponse = await generateAIResponse(userText, language)
    setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }])
    setIsTyping(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50 animate-pulse"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-4 h-4 text-orange-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about schemes, eligibility..."
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-2"
          />
          <button
            onClick={handleSend}
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
          AI responses should be verified with official sources
        </p>
      </div>
    </div>
  )
}
