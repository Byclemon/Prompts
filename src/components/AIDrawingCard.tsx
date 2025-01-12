import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { Prompt } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

interface AIDrawingCardProps {
  prompt: Prompt
}

export function AIDrawingCard({ prompt }: AIDrawingCardProps) {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState<'positive' | 'negative' | 'share' | null>(null)
  const router = useRouter()

  const handleCopy = async (text: string | undefined, type: 'positive' | 'negative') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const CopyButton = ({ text, type }: { text: string | undefined; type: 'positive' | 'negative' }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleCopy(text, type)}
      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      title={t(`ai-drawing.copy${type === 'positive' ? 'Positive' : 'Negative'}`)}
    >
      {copied === type ? (
        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </motion.button>
  )

  // 生成详情页面URL
  const getDetailUrl = () => {
    return `${window.location.origin}/ai-drawing/${prompt.category}/${prompt.id}`
  }

  // 复制分享链接
  const handleShare = () => {
    const url = getDetailUrl()
    navigator.clipboard.writeText(url)
    setCopied('share')
    setTimeout(() => setCopied(null), 2000)
    toast.success(t('copySuccess'))
  }

  return (
    <motion.div 
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* 预览图 */}
      {prompt.preview && (
        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img 
            src={prompt.preview}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* 分享按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            title={t('copyLink')}
          >
            {copied === 'share' ? (
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </motion.button>
        </div>
      )}

      <div className="p-6">
        {/* 标题和描述 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {prompt.title}
            </h3>
            {prompt.authorUrl ? (
              <a
                href={prompt.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:underline decoration-blue-500/30 dark:decoration-blue-400/30 transition-all duration-200 ease-in-out flex items-center gap-1"
              >
                <span>👤</span>
                <span>{prompt.author}</span>
              </a>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>👤</span>
                <span>{prompt.author}</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {prompt.description}
          </p>
        </div>

        {/* 风格和场景 */}
        {(prompt.style || prompt.scene) && (
          <div className="flex gap-2 mb-4">
            {prompt.style && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('ai-drawing.style')}:</span> {prompt.style}
              </div>
            )}
            {prompt.scene && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('ai-drawing.scene')}:</span> {prompt.scene}
              </div>
            )}
          </div>
        )}

        {/* 正面提示词 */}
        {prompt.positive && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('ai-drawing.positive')}
              </h3>
              <CopyButton text={prompt.positive} type="positive" />
            </div>
            <div className="relative">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {prompt.positive}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
            </div>
          </div>
        )}

        {/* 负面提示词 */}
        {prompt.negative && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('ai-drawing.negative')}
              </h3>
              <CopyButton text={prompt.negative} type="negative" />
            </div>
            <div className="relative">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {prompt.negative}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
            </div>
          </div>
        )}

        {/* 参数设置 */}
        {prompt.settings && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              {t('ai-drawing.settings')}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('ai-drawing.steps')}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prompt.settings.steps}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('ai-drawing.cfg')}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prompt.settings.cfg}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('ai-drawing.sampler')}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title={prompt.settings.sampler}>
                  {prompt.settings.sampler}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 