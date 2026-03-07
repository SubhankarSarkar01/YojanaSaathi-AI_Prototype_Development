import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { toast } from 'sonner'

interface VoiceSearchProps {
  onResult: (text: string) => void
  language?: string
  className?: string
}

// Indian language codes for Web Speech API
const INDIAN_LANGUAGE_CODES: Record<string, string> = {
  en: 'en-IN',      // English (India)
  hi: 'hi-IN',      // Hindi
  bn: 'bn-IN',      // Bengali
  te: 'te-IN',      // Telugu
  mr: 'mr-IN',      // Marathi
  ta: 'ta-IN',      // Tamil
  gu: 'gu-IN',      // Gujarati
  kn: 'kn-IN',      // Kannada
  ml: 'ml-IN',      // Malayalam
  pa: 'pa-IN',      // Punjabi
  or: 'or-IN',      // Odia
  as: 'as-IN',      // Assamese
  ur: 'ur-IN',      // Urdu
}

export default function VoiceSearch({ 
  onResult, 
  language = 'en',
  className = ''
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1
      
      // Set language based on current app language
      const langCode = INDIAN_LANGUAGE_CODES[language] || 'en-IN'
      recognitionInstance.lang = langCode
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
        toast.info(language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')
      }
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onResult(transcript)
        toast.success(language === 'hi' ? 'आवाज़ पहचानी गई!' : 'Voice recognized!')
      }
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        let errorMessage = 'Voice recognition failed'
        if (language === 'hi') {
          errorMessage = 'आवाज़ पहचान विफल'
        }
        
        if (event.error === 'no-speech') {
          errorMessage = language === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी' : 'No speech detected'
        } else if (event.error === 'not-allowed') {
          errorMessage = language === 'hi' ? 'माइक्रोफ़ोन की अनुमति नहीं' : 'Microphone permission denied'
        } else if (event.error === 'network') {
          errorMessage = language === 'hi' ? 'नेटवर्क त्रुटि' : 'Network error'
        }
        
        toast.error(errorMessage)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      console.warn('Web Speech API not supported in this browser')
    }
    
    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [language])

  const startListening = () => {
    if (!isSupported) {
      toast.error(language === 'hi' 
        ? 'आपका ब्राउज़र आवाज़ खोज का समर्थन नहीं करता' 
        : 'Your browser does not support voice search')
      return
    }
    
    if (recognition && !isListening) {
      try {
        // Update language before starting
        const langCode = INDIAN_LANGUAGE_CODES[language] || 'en-IN'
        recognition.lang = langCode
        recognition.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        toast.error(language === 'hi' ? 'आवाज़ खोज शुरू नहीं हो सकी' : 'Could not start voice search')
      }
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  if (!isSupported) {
    return null // Don't render if not supported
  }

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={`flex items-center justify-center transition-all ${className} ${
        isListening 
          ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
      }`}
      title={isListening 
        ? (language === 'hi' ? 'सुनना बंद करें' : 'Stop listening')
        : (language === 'hi' ? 'आवाज़ से खोजें' : 'Voice search')
      }
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  )
}
