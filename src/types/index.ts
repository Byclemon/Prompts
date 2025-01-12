export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  author: string
  authorUrl?: string | null
  category: string
  platforms: string[]
  tags: string[]
  created: string
  updated: string
  // AI 绘画特有字段
  style?: string | null
  scene?: string | null
  positive?: string | null
  negative?: string | null
  settings?: {
    steps: number
    cfg: number
    sampler: string
  } | null
  preview?: string | null
  // 多语言内容
  contents?: Record<string, {
    content: string
    title?: string
    description?: string
  }>
} 