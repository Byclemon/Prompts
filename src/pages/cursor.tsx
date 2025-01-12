import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Navbar from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PromptCard } from '@/components/PromptCard'
import { getPromptList } from '@/utils/prompts'
import type { Prompt } from '@/types'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import fs from 'fs/promises'
import path from 'path'
import { SEO } from '@/components/SEO'

interface Props {
  categories: Array<{ id: string; icon: string }>
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  all: '🌟',
  javascript: '💛',
  typescript: '📘',
  python: '🐍',
  java: '☕',
  go: '🐹',
  rust: '🦀',
  php: '🐘',
  swift: '🍎',
  c: '©️',
  cpp: '➕',
  ruby: '💎',
  dotnet: '🎯',
  ai: '🤖',
  blockchain: '⛓️',
  cloud: '☁️',
  design: '🎨',
  devops: '🔧',
  flutter: '💙',
  tools: '🛠️',
  meta: '📚',
  other: '📁'
}

export default function CursorPage({ categories }: Props) {
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
        `/api/prompts?type=cursor&page=${page}&category=${selectedCategory}&search=${searchQuery}&sortBy=${sortBy}&locale=${router.locale || 'zh'}`
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
      <SEO 
        title={t('nav.cursor')}
        description={t('locale') === 'zh' 
          ? '专业的 Cursor AI 编程助手提示词库，收录海量编程相关提示词，涵盖 JavaScript、TypeScript、Python、Java 等多种编程语言。提供代码生成、重构、调试、测试等场景的优质提示词，助您提升编程效率。支持中英双语，提供在线复制和分享功能。'
          : 'Professional Cursor AI programming assistant prompt library, featuring extensive programming prompts for JavaScript, TypeScript, Python, Java, and more. Includes prompts for code generation, refactoring, debugging, testing, and other development scenarios. Bilingual support with easy copy and share features.'
        }
        keywords={t('locale') === 'zh'
          ? 'Cursor AI,AI编程助手,编程提示词,代码生成器,JavaScript提示词,TypeScript提示词,Python提示词,Java提示词,代码重构,代码调试,单元测试,AI代码审查,编程效率工具,代码优化,编程学习,AI编程指南,代码生成提示词,编程技巧,开发工具,软件开发'
          : 'Cursor AI,AI programming assistant,coding prompts,code generator,JavaScript prompts,TypeScript prompts,Python prompts,Java prompts,code refactoring,debugging,unit testing,AI code review,programming efficiency,code optimization,programming learning,AI coding guide,code generation prompts,coding techniques,development tools,software development'
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
            categoryNamePrefix="cursor.categories"
          />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-end items-center mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="bg-background border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="date">{t('cursor.sortByDate')}</option>
                <option value="title">{t('cursor.sortByTitle')}</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('cursor.loading')}</p>
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
                  <p className="text-gray-500">{t('cursor.noResults')}</p>
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
    const prompts = await getPromptList('cursor', locale || 'zh')
    
    // 使用已有的分类数据
    const categories = Object.entries(categoryIcons).map(([id, icon]) => ({
      id,
      icon
    }))

    // 只返回必要的字段
    const simplifiedPrompts = prompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      author: prompt.author,
      platforms: prompt.platforms,
      updated: prompt.updated
    }))

    return {
      props: {
        ...(await serverSideTranslations(locale || 'zh', ['common'])),
        prompts: simplifiedPrompts,
        categories
      },
      revalidate: 60
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