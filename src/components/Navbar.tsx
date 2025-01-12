import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const newLocale = router.locale === 'zh' ? 'en' : 'zh'
    router.push(router.pathname, router.asPath, { locale: newLocale, scroll: false })
  }

  // 渲染主题切换按钮
  const renderThemeButton = () => {
    if (!mounted) return <div className="w-9 h-9" />

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        title={t(`nav.theme.${theme === 'dark' ? 'light' : 'dark'}`)}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </motion.button>
    )
  }

  return (
    <div className="h-16">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
          <div className="mx-auto">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <Link 
                href="/"
                locale={router.locale}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                  Prompts
                </span>
                <span className="text-2xl">✨</span>
              </Link>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <Link 
                    href="/ai-drawing"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {t('nav.aiDrawing')}
                  </Link>
                  <Link 
                    href="/cursor"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {t('nav.cursor')}
                  </Link>
                  <Link 
                    href="/guide"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {t('nav.guide')}
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLanguage}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={router.locale === 'zh' ? 'Switch to English' : '切换到中文'}
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {router.locale === 'zh' ? 'En' : '中'}
                    </span>
                  </motion.button>

                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

                  {renderThemeButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
} 