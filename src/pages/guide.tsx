import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import Navbar from '@/components/Navbar'
import { SEO } from '@/components/SEO'

export default function Guide() {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={t('guide.title')}
        description={t('guide.description')}
        keywords={t('locale') === 'zh' 
          ? 'AI提示词教程,提示词编写指南,AI提示词技巧,ChatGPT提示词教程,Midjourney提示词教程,AI提示词最佳实践,提示词优化指南,AI助手使用指南'
          : 'AI prompts tutorial,prompt writing guide,AI prompt techniques,ChatGPT prompt tutorial,Midjourney prompt guide,AI prompts best practices,prompt optimization guide,AI assistant usage guide'
        }
      />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold">{t('guide.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('guide.description')}</p>

          {/* 什么是提示词 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">{t('guide.sections.what.title')}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('guide.sections.what.content')}</p>
            
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {(t('guide.sections.what.examples', { returnObjects: true }) as Array<any>).map((example, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                  <h3 className="font-medium text-lg">{example.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{example.content}</p>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">{example.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 如何使用 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">{t('guide.sections.how.title')}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('guide.sections.how.intro')}</p>
            
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {(t('guide.sections.how.steps', { returnObjects: true }) as Array<any>).map((step, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.content}</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 使用技巧 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">{t('guide.sections.tips.title')}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('guide.sections.tips.intro')}</p>
            
            {/* 基础技巧 */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <ul className="space-y-4">
                {(t('guide.sections.tips.list', { returnObjects: true }) as Array<string>).map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 进阶技巧 */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">{t('guide.sections.tips.advanced.title')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(t('guide.sections.tips.advanced.list', { returnObjects: true }) as Array<any>).map((tip, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg text-lg font-medium">
                        {['🔄', '👥', '❓', '💬'][index]}
                      </span>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{tip.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 支持的平台 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">{t('guide.sections.platforms.title')}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('guide.sections.platforms.intro')}</p>
            
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {(t('guide.sections.platforms.list', { returnObjects: true }) as Array<any>).map((platform, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{platform.features}</p>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">{platform.tips}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  }
} 