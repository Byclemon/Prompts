import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import type { Prompt } from '@/types'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState<'content' | 'share' | null>(null)
  const router = useRouter()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content ?? '')
      toast.success('已复制到剪贴板')
      setCopied('content')
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      toast.error('复制失败')
    }
  }

  // 限制平台显示数量
  const displayPlatforms = prompt.platforms.slice(0, 3)
  const hasMorePlatforms = prompt.platforms.length > 3

  // 生成详情页面URL
  const getDetailUrl = () => {
    const pathname = router.pathname
    let basePath = 'prompts'
    if (pathname.startsWith('/ai-drawing')) {
      basePath = 'ai-drawing'
    } else if (pathname.startsWith('/cursor')) {
      basePath = 'cursor'
    }
    return `${window.location.origin}/${basePath}/${prompt.category}/${prompt.id}`
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="group bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800/80 dark:to-gray-900/50 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800"
    >
      {/* 标题区域 */}
      <div className="p-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl w-8 flex-shrink-0 flex justify-center">
            {prompt.platforms[0] === 'ChatGPT' ? '🤖' : '🎨'}
          </span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
            {prompt.title}
          </h3>
        </div>
      </div>

      {/* 提示词内容 */}
      <div className="px-6">
        <div className="relative bg-gray-50/70 dark:bg-gray-900/50 rounded-md ring-1 ring-gray-950/5 dark:ring-white/10">
          {/* 操作按钮 */}
          <div className="absolute right-3 top-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="action-button"
              title={copied === 'content' ? t('prompt.copied') : t('prompt.copy')}
            >
              {copied === 'content' ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
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

          {/* 内容区域 */}
          <div className="h-[450px] overflow-y-auto overscroll-contain scrollbar-thin pt-16 pb-4 px-5">
            <div className="font-mono text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {(prompt.content || '').trim()}
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="px-6 py-4 mt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 min-w-0 max-w-[60%]">
            <span className="text-amber-500 flex-shrink-0">💡</span>
            <span className="truncate">
              {t('prompt.platforms', { 
                platforms: displayPlatforms.join(' / ') + (hasMorePlatforms ? ' ...' : '')
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0 max-w-[35%]">
            <span className="flex-shrink-0">👤</span>
            {prompt.authorUrl ? (
              <a
                href={prompt.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:underline decoration-blue-500/30 dark:decoration-blue-400/30 transition-all duration-200 ease-in-out"
              >
                {t('prompt.author', { name: prompt.author })}
              </a>
            ) : (
              <span className="truncate text-gray-500 dark:text-gray-400">
                {t('prompt.author', { name: prompt.author })}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 