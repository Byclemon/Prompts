import { GetStaticProps, GetStaticPaths } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SEO } from '@/components/SEO'
import { getPromptDetail, getPromptList } from '@/utils/prompts'
import { Prompt } from '@/types'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface PromptDetailProps {
  prompt: Prompt
}

export default function AIDrawingDetail({ prompt }: PromptDetailProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [copied, setCopied] = useState<'positive' | 'negative' | null>(null)

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600 dark:text-gray-300">{t('loading')}</div>
    </div>
  }

  const handleCopy = async (text: string | undefined, type: 'positive' | 'negative') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
      toast.success(t('copySuccess'))
    } catch (err) {
      toast.error('复制失败')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO 
        title={prompt.title}
        description={prompt.description}
        keywords={`${prompt.title},${prompt.category},${prompt.platforms.join(',')}`}
        publishedTime={prompt.created}
        modifiedTime={prompt.updated}
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          {/* 标题区域 */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {prompt.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {prompt.description}
            </p>
          </div>

          {/* 元信息 */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <span className="mr-2">{t('author')}:</span>
              {prompt.authorUrl ? (
                <a 
                  href={prompt.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline decoration-blue-500/30 dark:text-blue-400"
                >
                  {prompt.author}
                </a>
              ) : (
                <span>{prompt.author}</span>
              )}
            </div>
            <div>
              <span className="mr-2">{t('category')}:</span>
              <span>{prompt.category}</span>
            </div>
            <div>
              <span className="mr-2">{t('platforms')}:</span>
              <span>{prompt.platforms.join(', ')}</span>
            </div>
            <div>
              <span className="mr-2">{t('updated')}:</span>
              <span>{prompt.updated}</span>
            </div>
          </div>

          {/* 预览图 */}
          {prompt.preview && (
            <div className="mb-8 aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
              <img 
                src={prompt.preview}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 风格和场景 */}
          {(prompt.style || prompt.scene) && (
            <div className="flex gap-4 mb-8">
              {prompt.style && (
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('ai-drawing.style')}:</span>{' '}
                  {prompt.style}
                </div>
              )}
              {prompt.scene && (
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('ai-drawing.scene')}:</span>{' '}
                  {prompt.scene}
                </div>
              )}
            </div>
          )}

          {/* 提示词区域 */}
          <div className="space-y-6">
            {/* 正面提示词 */}
            {prompt.positive && (
              <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('ai-drawing.positive')}
                </h2>
                <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {prompt.positive}
                </pre>
                <button
                  onClick={() => prompt.positive && handleCopy(prompt.positive, 'positive')}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 active:scale-95"
                  title={t('copyPositive')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}

            {/* 负面提示词 */}
            {prompt.negative && (
              <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('ai-drawing.negative')}
                </h2>
                <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {prompt.negative}
                </pre>
                <button
                  onClick={() => prompt.negative && handleCopy(prompt.negative, 'negative')}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 active:scale-95"
                  title={t('copyNegative')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}

            {/* 参数设置 */}
            {prompt.settings && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('ai-drawing.settings')}
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('ai-drawing.steps')}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {prompt.settings.steps}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('ai-drawing.cfg')}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {prompt.settings.cfg}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('ai-drawing.sampler')}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {prompt.settings.sampler}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.article>
        <ScrollToTop />
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  try {
    // 获取所有提示词列表
    const prompts = await getPromptList('ai-drawing')
    
    // 为每个提示词生成路径
    const paths = prompts.flatMap(prompt => {
      // 为每个语言生成路径
      return (locales.length ? locales : ['zh']).map(locale => ({
        params: {
          category: prompt.category,
          id: prompt.id
        },
        locale
      }))
    })

    return {
      paths,
      fallback: true
    }
  } catch (error) {
    console.error('Error generating paths:', error)
    return {
      paths: [],
      fallback: true
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (!params?.category || !params?.id || 
      typeof params.category !== 'string' || 
      typeof params.id !== 'string') {
    return { notFound: true }
  }

  try {
    const promptPath = `ai-drawing/${params.category}/${params.id}`
    const prompt = await getPromptDetail(promptPath, locale || 'zh')
    if (!prompt) {
      return { notFound: true }
    }
    
    return {
      props: {
        ...(await serverSideTranslations(locale || 'zh', ['common'])),
        prompt
      },
      revalidate: 60 // 每分钟重新生成页面
    }
  } catch (error) {
    return { notFound: true }
  }
} 