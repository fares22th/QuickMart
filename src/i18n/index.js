import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import en from './en.json'

const saved = localStorage.getItem('qm-lang') ?? 'ar'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: saved,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
  })

// Sync document direction on init
document.documentElement.setAttribute('dir', saved === 'ar' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', saved)

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('qm-lang', lang)
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', lang)
})

export default i18n
