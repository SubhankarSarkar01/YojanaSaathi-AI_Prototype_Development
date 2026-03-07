interface ChatRequest {
  message: string
  language: string
  schemeContext: string
}

interface ParsedScheme {
  name: string
  category: string
  level: string
  department: string
  benefit: string
  description: string
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

class ChatbotService {
  private readonly baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'
  private readonly model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  async generateResponse(request: ChatRequest): Promise<string> {
    const { message, language, schemeContext } = request
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return this.getLocalResponse(message, language, schemeContext, true)
    }

    const prompt = this.buildPrompt(message, language, schemeContext)

    try {
      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text:
                  'You are YojanaSaathi AI. Help users with Indian government schemes. Be concise, accurate, and practical.',
              },
            ],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            topP: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!response.ok) {
        return this.getLocalResponse(message, language, schemeContext, false)
      }

      const data = (await response.json()) as GeminiGenerateContentResponse
      const content = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim()

      if (!content) {
        return this.getLocalResponse(message, language, schemeContext, false)
      }

      return content
    } catch {
      return this.getLocalResponse(message, language, schemeContext, false)
    }
  }

  private buildPrompt(message: string, language: string, schemeContext: string): string {
    return [
      `User language preference: ${language === 'hi' ? 'Hindi' : 'English'}`,
      'Use the provided scheme list when relevant and avoid making up scheme names.',
      schemeContext ? `Available schemes:\n${schemeContext}` : 'No local scheme context was provided.',
      `User question: ${message}`,
    ].join('\n\n')
  }

  private getLocalResponse(
    message: string,
    language: string,
    schemeContext: string,
    missingApiKey: boolean
  ): string {
    const schemes = this.parseSchemes(schemeContext)
    const categories = [...new Set(schemes.map((scheme) => scheme.category).filter(Boolean))]
    const lowerMessage = message.toLowerCase()

    const greetingPattern = /\b(hi|hello|hey|namaste|good morning|good evening)\b/i
    if (greetingPattern.test(message)) {
      if (language === 'hi') {
        const prefix = missingApiKey
          ? 'Namaste! AI key configured nahi hai, lekin main available scheme data se madad kar sakta hoon.'
          : 'Namaste! AI service issue hai, lekin main available scheme data se madad kar sakta hoon.'
        return `${prefix}\n\nAap puchh sakte hain:\n- category list\n- kisi specific scheme ka naam\n- eligibility guidance`
      }
      const prefix = missingApiKey
        ? 'Namaste! AI key is not configured, but I can still help from available scheme data.'
        : 'Namaste! AI service is currently unavailable, but I can still help from available scheme data.'
      return `${prefix}\n\nYou can ask for:\n- category list\n- a specific scheme name\n- basic eligibility guidance`
    }

    if (/(category|categories|type|types|list)/i.test(lowerMessage) && categories.length > 0) {
      if (language === 'hi') {
        return `Available categories:\n${categories.map((category) => `- ${category}`).join('\n')}\n\nAap kisi ek category ka naam bhejkar schemes puchh sakte hain.`
      }
      return `Available categories:\n${categories.map((category) => `- ${category}`).join('\n')}\n\nYou can reply with one category name to see relevant schemes.`
    }

    const matchedSchemes = schemes
      .filter((scheme) => {
        const haystack = `${scheme.name} ${scheme.category} ${scheme.level} ${scheme.department} ${scheme.description}`.toLowerCase()
        return lowerMessage.split(/\s+/).some((word) => word.length > 2 && haystack.includes(word))
      })
      .slice(0, 3)

    if (matchedSchemes.length > 0) {
      if (language === 'hi') {
        return `Mujhe ${matchedSchemes.length} relevant scheme(s) mili:\n\n${matchedSchemes
          .map((scheme, index) => `${index + 1}. ${scheme.name}\n   Category: ${scheme.category}\n   Benefit: ${scheme.benefit}`)
          .join('\n\n')}\n\nAgar chaho to main inme se kisi ek ke details samjha sakta hoon.`
      }
      return `I found ${matchedSchemes.length} relevant scheme(s):\n\n${matchedSchemes
        .map((scheme, index) => `${index + 1}. ${scheme.name}\n   Category: ${scheme.category}\n   Benefit: ${scheme.benefit}`)
        .join('\n\n')}\n\nAsk me for details on any one of these.`
    }

    if (schemes.length > 0) {
      const sample = schemes.slice(0, 3).map((scheme) => `- ${scheme.name} (${scheme.category})`).join('\n')
      if (language === 'hi') {
        return `Main local scheme data se madad kar sakta hoon. Yahan kuch schemes hain:\n${sample}\n\nAap specific scheme name ya category type kijiye.`
      }
      return `I can help using local scheme data. Here are some schemes:\n${sample}\n\nType a specific scheme name or category.`
    }

    if (language === 'hi') {
      return missingApiKey
        ? 'AI key configured nahi hai aur local scheme data bhi available nahi hai. Kripya backend me GEMINI_API_KEY set karein.'
        : 'AI service aur local data dono unavailable hain. Kripya thodi der baad phir try karein.'
    }

    return missingApiKey
      ? 'AI key is not configured and local scheme data is unavailable. Please set GEMINI_API_KEY in backend.'
      : 'AI service and local scheme data are currently unavailable. Please try again shortly.'
  }

  private parseSchemes(schemeContext: string): ParsedScheme[] {
    if (!schemeContext.trim()) {
      return []
    }

    return schemeContext
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block): ParsedScheme => {
        const lines = block.split('\n').map((line) => line.trim())
        const firstLine = lines.find((line) => /^\d+\.\s+/.test(line)) || ''
        const name = firstLine.replace(/^\d+\.\s+/, '').trim()

        const pick = (prefix: string) =>
          lines.find((line) => line.toLowerCase().startsWith(prefix.toLowerCase() + ':'))?.split(':').slice(1).join(':').trim() || 'N/A'

        return {
          name: name || 'Unnamed Scheme',
          category: pick('Category'),
          level: pick('Level'),
          department: pick('Department'),
          benefit: pick('Benefit'),
          description: pick('Description'),
        }
      })
  }
}

export default new ChatbotService()
