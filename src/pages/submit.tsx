import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SEO } from '@/components/SEO'

export default function Submit() {
  const { t } = useTranslation('submit')
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO 
        title={t('title')}
        description={t('locale') === 'zh' 
          ? '欢迎提交您的AI提示词！我们提供完整的提交指南，包括提示词格式规范、分类说明、元数据要求等。支持GitHub和邮件两种提交方式，让分享AI提示词变得简单便捷。加入我们的开源社区，一起构建优质的AI提示词库。'
          : 'Submit your AI prompts! We provide comprehensive submission guidelines, including prompt format specifications, category explanations, and metadata requirements. Support both GitHub and email submission methods. Join our open-source community and help build a high-quality AI prompt library.'
        }
        keywords={t('locale') === 'zh'
          ? 'AI提示词提交,提示词分享,提示词投稿,AI提示词格式,提示词编写规范,AI提示词贡献,开源社区,GitHub提交,提示词收录,AI内容创作,提示词编写指南,AI提示词模板,提示词最佳实践,内容投稿,社区贡献'
          : 'AI prompt submission,prompt sharing,prompt contribution,AI prompt format,prompt writing guidelines,AI prompt contribution,open source community,GitHub submission,prompt collection,AI content creation,prompt writing guide,AI prompt template,prompt best practices,content submission,community contribution'
        }
        publishedTime="2024-01-01"
        modifiedTime={new Date().toISOString()}
      />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* 标题 */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>
          </div>

          {/* 基本要求 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('basicRequirements')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(t('requirements', { returnObjects: true })).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{value as string}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 文件结构 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('fileStructure')}
            </h2>
            <div className="space-y-6">
              {Object.entries(t('fileStructureDesc', { returnObjects: true })).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-xl mb-2">{key}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">{value as string}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{`content/prompts/ai/senior-frontend-dev/
├── metadata.json
├── zh.md
└── en.md`}</code>
              </pre>
            </div>
          </section>

          {/* 分类说明 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('categories.description')}
            </p>
            
            {/* 提示词分类 */}
            <div className="mb-6">
              <button
                onClick={() => toggleCategory('prompt')}
                className="w-full flex items-center justify-between text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">📝</span>
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                    {t('categories.promptCategories.title')}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openCategory === 'prompt' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openCategory === 'prompt' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {Object.entries(t('categories.promptCategories.list', { returnObjects: true })).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-2">{key}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{value as string}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Cursor分类 */}
            <div className="mb-6">
              <button
                onClick={() => toggleCategory('cursor')}
                className="w-full flex items-center justify-between text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">💻</span>
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                    {t('categories.cursorCategories.title')}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openCategory === 'cursor' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openCategory === 'cursor' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {Object.entries(t('categories.cursorCategories.list', { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">{key}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(`categories.cursorCategories.examples.${key}`)}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* AI绘画分类 */}
            <div>
              <button
                onClick={() => toggleCategory('aiDrawing')}
                className="w-full flex items-center justify-between text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">🎨</span>
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                    {t('categories.aiDrawingCategories.title')}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openCategory === 'aiDrawing' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openCategory === 'aiDrawing' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {Object.entries(t('categories.aiDrawingCategories.list', { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">{key}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(`categories.aiDrawingCategories.examples.${key}`)}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          {/* 元数据格式 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('metadataFormat')}
            </h2>
            <div className="space-y-6">
              {Object.entries(t('metadataDesc', { returnObjects: true })).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white text-xl mb-2">{key}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{`{
  "id": "senior-frontend-dev",
  "category": "ai",
  "platforms": ["chatgpt", "claude"],
  "author": "byclemon",
  "authorUrl": "https://github.com/byclemon",
  "tags": ["frontend", "development", "react", "typescript"],
  "created": "2024-01-15",
  "updated": "2024-01-15"
}`}</code>
              </pre>
            </div>
          </section>

          {/* Markdown格式 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('markdownFormat')}
            </h2>
            <div className="space-y-6">
              {Object.entries(t('markdownDesc', { returnObjects: true })).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white text-xl mb-2">{key}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{`---
title: 高级前端开发专家
description: 一个专业的前端开发专家，帮助你解决各种前端开发问题
---

我希望你能作为一个资深的前端开发专家，帮助我解决前端开发中遇到的各种问题。你应该具备以下技能和知识：

1. 精通 HTML5、CSS3、JavaScript/TypeScript
2. 熟练掌握 React、Vue、Angular 等主流框架
3. 了解前端工程化、性能优化、安全性等最佳实践
4. 具备良好的代码设计和架构能力

请以专业、耐心的态度回答我的问题，并提供详细的解决方案和代码示例。

## 使用说明

1. 描述你遇到的具体问题
2. 提供相关的代码片段或错误信息
3. 说明你期望达到的效果

## 示例

问题：如何优化 React 组件的性能？

回答：这里是一些 React 性能优化的关键策略：
1. 使用 React.memo() 避免不必要的重渲染
2. 合理使用 useMemo 和 useCallback
3. 实现虚拟列表来处理大量数据
...`}</code>
              </pre>
            </div>
          </section>

          {/* 提交步骤 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('howToSubmit')}
            </h2>
            <div className="space-y-6">
              {Object.entries(t('submitSteps', { returnObjects: true })).map(([key, value], index) => (
                <div key={key} className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg pt-2">{value as string}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 提交建议 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('tips.title')}
            </h2>
            <div className="space-y-6">
              {(t('tips.list', { returnObjects: true }) as string[]).map((tip, index) => (
                <div key={index} className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 提交按钮 */}
          <div className="flex flex-col items-center py-6 space-y-6">
            {/* GitHub 提交 */}
            <Link
              href="https://github.com/Byclemon/Prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
            >
              {t('submitButton')}
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            {/* 分隔线 */}
            <div className="flex items-center w-full max-w-md">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">{t('locale') === 'zh' ? '或者' : 'OR'}</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* 邮箱提交 */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {t('emailSubmit.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('emailSubmit.description')}
              </p>
              <Link
                href="mailto:byclemon@gmail.com"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                byclemon@gmail.com
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('emailSubmit.note')}
              </p>
            </div>
          </div>
        </motion.div>
        <ScrollToTop />
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'zh' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['submit', 'common'])),
    },
  }
} 