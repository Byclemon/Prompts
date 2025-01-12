import { NextApiRequest, NextApiResponse } from 'next'
import { getPromptList } from '@/utils/prompts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type = 'prompts', page = '1', category = 'all', search = '', sortBy = 'date', locale = 'zh' } = req.query

  try {
    // 获取提示词列表
    const prompts = await getPromptList(type as string, locale as string)

    // 过滤分类
    let filteredPrompts = category === 'all'
      ? prompts
      : prompts.filter(prompt => prompt.category === category)

    // 搜索过滤
    if (search) {
      const searchLower = search.toString().toLowerCase()
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.description.toLowerCase().includes(searchLower)
      )
    }

    // 排序
    if (sortBy === 'title') {
      filteredPrompts.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      filteredPrompts.sort((a, b) => {
        const dateA = new Date(a.updated || a.created)
        const dateB = new Date(b.updated || b.created)
        return dateB.getTime() - dateA.getTime()
      })
    }

    // 分页
    const pageSize = 12
    const pageNum = parseInt(page as string)
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const paginatedPrompts = filteredPrompts.slice(start, end)
    const totalPages = Math.ceil(filteredPrompts.length / pageSize)

    res.status(200).json({
      prompts: paginatedPrompts,
      totalPages,
      currentPage: pageNum
    })
  } catch (error) {
    console.error('Error in prompts API:', error)
    res.status(500).json({ error: 'Failed to fetch prompts' })
  }
} 