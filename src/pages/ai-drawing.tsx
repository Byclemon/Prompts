import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getPromptList } from '@/utils/prompts'
import Navbar from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { AIDrawingCard } from '@/components/AIDrawingCard'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fs from 'fs/promises'
import path from 'path'
import { Prompt } from '@/types'
import { SEO } from '@/components/SEO'

interface Props {
  categories: Array<{ id: string; icon: string }>
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  all: '🌟',
  abstract: '🎯',
  anime: '💫',
  architecture: '🏛️',
  character: '👤',
  'concept-art': '💡',
  fantasy: '🦄',
  fashion: '👗',
  food: '🍳',
  illustration: '✏️',
  interior: '🏠',
  landscape: '🌅',
  nature: '🌿',
  other: '📁',
  pet: '🐾',
  portrait: '📸',
  product: '📱',
  realistic: '🎨',
  'sci-fi': '🚀',
  style: '🎨',
  vehicle: '🚗'
}

export default function AIDrawingPage({ categories }: Props) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [page, setPage] = useState(1)
  const [drawings, setDrawings] = useState<Prompt[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // 从 URL 查询参数中获取初始状态
  useEffect(() => {
    const { category, q } = router.query
    if (category && typeof category === 'string') {
      setSelectedCategory(category)
    }
    if (q && typeof q === 'string') {
      setSearchQuery(q)
    }
  }, [router.query])

  // 更新 URL 查询参数
  useEffect(() => {
    const query: { [key: string]: string } = {}
    if (selectedCategory !== 'all') {
      query.category = selectedCategory
    }
    if (searchQuery) {
      query.q = searchQuery
    }
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }, [selectedCategory, searchQuery])

  // 获取 AI 绘画数据
  const fetchDrawings = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `/api/prompts?type=ai-drawing&page=${page}&category=${selectedCategory}&search=${searchQuery}&sortBy=${sortBy}&locale=${router.locale || 'zh'}`
      )
      const data = await res.json()
      setDrawings(data.prompts)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching drawings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 当依赖项变化时重新获取数据
  useEffect(() => {
    fetchDrawings()
  }, [page, selectedCategory, searchQuery, sortBy, router.locale])

  // 处理页面变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 重置分页
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={t('nav.aiDrawing')}
        description={t('locale') === 'zh' 
          ? '专业的AI绘画提示词库，收录海量Midjourney提示词、Stable Diffusion提示词。包含人物、场景、风格等多个分类，助您轻松创作优质AI艺术作品。提供中英双语，支持在线复制和分享。'
          : 'Professional AI art prompt library featuring extensive Midjourney and Stable Diffusion prompts. Includes categories for characters, scenes, styles, and more. Create stunning AI artwork effortlessly. Bilingual support with easy copy and share features.'
        }
        keywords={t('locale') === 'zh'
          ? 'AI绘画,Midjourney提示词,Stable Diffusion提示词,AI艺术创作,AI绘画提示词,AI画图提示词,人物绘画提示词,场景绘画提示词,艺术风格提示词,AI绘画教程,AI作画,AI绘画指南,AI绘画技巧,AI艺术生成,AI画图软件'
          : 'AI art,Midjourney prompts,Stable Diffusion prompts,AI artwork,AI art prompts,character prompts,scene prompts,art style prompts,AI art tutorial,AI drawing,AI art guide,AI art techniques,AI art generation,AI drawing software'
        }
        publishedTime="2024-01-01"
        modifiedTime={new Date().toISOString()}
      />
      <Navbar />
      <div className="max-w-8xl mx-auto">
        <div className="flex">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={() => setIsMobileMenuOpen(false)}
            categoryNamePrefix="ai-drawing.categories"
          />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-end items-center mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="bg-background border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="date">{t('ai-drawing.sortByDate')}</option>
                <option value="title">{t('ai-drawing.sortByTitle')}</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('ai-drawing.loading')}</p>
                </div>
              ) : drawings.length > 0 ? (
                drawings.map(drawing => (
                  <AIDrawingCard
                    key={drawing.id}
                    prompt={drawing}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('ai-drawing.noResults')}</p>
                </div>
              )}
            </div>

            {/* 分页控件 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const prompts = await getPromptList('ai-drawing', locale || 'zh')
    
    // 添加分类数据
    const categories = Object.entries(categoryIcons).map(([id, icon]) => ({
      id,
      icon
    }))
    
    return {
      props: {
        ...(await serverSideTranslations(locale || 'zh', ['common'])),
        prompts,
        categories
      },
      revalidate: 60 // 每分钟重新生成页面
    }
  } catch (error) {
    console.error('Error getting prompts:', error)
    return {
      props: {
        ...(await serverSideTranslations(locale || 'zh', ['common'])),
        prompts: [],
        categories: []
      }
    }
  }
} 