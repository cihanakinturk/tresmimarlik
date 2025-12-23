import { createI18n } from 'vue-i18n'
import tr from '@/locales/tr.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  legacy: false, // Composition API kullanımı için
  locale: 'tr', // Varsayılan dil
  fallbackLocale: 'tr', // Çeviri bulunamazsa Türkçe kullan
  messages: {
    tr,
    en,
  },
})

export default i18n
