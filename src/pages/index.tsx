import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getPromptList } from '@/utils/prompts'
import Navbar from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PromptCard } from '@/components/PromptCard'
import { SEO } from '@/components/SEO'
import type { Prompt } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fs from 'fs/promises'
import path from 'path'

interface Props {
  categories: Array<{ id: string; icon: string }>
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  all: '🌟',
  writing: '✍️',
  programming: '💻',
  ai: '🤖',
  life: '🌱',
  knowledge: '📚',
  psychology: '🧠',
  business: '💼',
  education: '🎓',
  design: '🎨',
  marketing: '📢',
  productivity: '⚡',
  health: '💪',
  finance: '💰',
  career: '💼',
  creativity: '🎯',
  language: '🗣️',
  research: '🔬',
  entertainment: '🎮',
  other: '📁'
}

export default function HomePage({ categories }: Props) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [page, setPage] = useState(1)
  const [prompts, setPrompts] = useState<Prompt[]>([])
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

  // 获取提示词数据
  const fetchPrompts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `/api/prompts?type=prompts&page=${page}&category=${selectedCategory}&search=${searchQuery}&sortBy=${sortBy}&locale=${router.locale || 'zh'}`
      )
      const data = await res.json()
      setPrompts(data.prompts)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 当依赖项变化时重新获取数据
  useEffect(() => {
    fetchPrompts()
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
      <SEO />
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
          />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-end items-center mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="bg-background border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="date">{t('home.sortByDate')}</option>
                <option value="title">{t('home.sortByTitle')}</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('home.loading')}</p>
                </div>
              ) : prompts.length > 0 ? (
                prompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('home.noResults')}</p>
                </div>
              )}
            </div>

            {/* 分页控件 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
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
    const prompts = await getPromptList('prompts', locale || 'zh')
    
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