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

export default function PromptDetail({ prompt }: PromptDetailProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-600 dark:text-gray-400">{t('loading')}</div>
          </div>
        </main>
      </div>
    )
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    toast.success(t('copySuccess'))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO 
        title={prompt.title}
        description={prompt.description}
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {prompt.title}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {prompt.description}
          </p>

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

          {/* 内容区域 */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('promptContent')}
              </h2>
              <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {prompt.content}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200 active:scale-95"
                title={t('copyToClipboard')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
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
    const prompts = await getPromptList('prompts')
    
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
    const promptPath = `prompts/${params.category}/${params.id}`
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