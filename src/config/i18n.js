import { createI18n } from 'vue-i18n'

import { m as chinese } from '../assets/lang/chinese'
import { m as english } from '../assets/lang/english'

/** 从 localStorage 读取语言，默认中文 */
function getLocale() {
  return localStorage.getItem('lang') || 'zh'
}

export const i18n = createI18n({
  legacy: true, // 兼容 $t / this.$i18n.locale 的旧写法
  locale: getLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh: { m: chinese },
    en: { m: english },
  },
})

export function setLocale(locale) {
  i18n.global.locale = locale
  localStorage.setItem('lang', locale)
}
