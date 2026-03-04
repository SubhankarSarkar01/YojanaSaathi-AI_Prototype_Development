import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => {
        i18n.changeLanguage(lang)
        set({ language: lang })
      },
    }),
    {
      name: 'language-storage',
    }
  )
)
