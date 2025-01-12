import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Prompt } from '@/types'

// Markdown frontmatter 类型
interface PromptFrontmatter {
  title?: string
  description?: string
  [key: string]: any
}

// 元数据类型
interface Metadata {
  author: string
  authorUrl?: string
  platforms: string[]
  tags: string[]
  created: string
  updated: string
  style?: string
  scene?: string
  preview?: string
  category?: string
}

export async function getPromptList(type: string, locale: string = 'zh'): Promise<Prompt[]> {
  const promptsDir = path.join(process.cwd(), `content/${type}`)
  const prompts: Prompt[] = []

  // 递归遍历目录
  async function traverse(dir: string, level: number = 0) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory()) {
          // 获取父目录名作为分类
          const parentDir = path.basename(dir)
          const isRoot = dir === promptsDir

          // 如果是第一层目录（分类目录），继续遍历
          if (level === 0) {
            await traverse(fullPath, level + 1)
            continue
          }

          // 检查是否存在 metadata.json 和内容文件
          const metadataPath = path.join(fullPath, 'metadata.json')
          const contentPath = path.join(fullPath, `${locale}.md`)
          const fallbackPath = path.join(fullPath, 'en.md') // 如果当前语言不存在，回退到英文

          try {
            // 读取元数据
            let metadata: Metadata = {
              author: 'Unknown',
              platforms: [],
              tags: [],
              created: new Date().toISOString(),
              updated: new Date().toISOString()
            }

            try {
              const metadataContent = await fs.readFile(metadataPath, 'utf-8')
              metadata = { ...metadata, ...JSON.parse(metadataContent) }
            } catch (err) {
              console.warn(`No metadata.json found for ${fullPath}`)
            }

            // 尝试读取内容文件
            let content = ''
            let frontmatter: PromptFrontmatter = {}

            try {
              // 首先尝试读取请求的语言文件
              const contentData = await fs.readFile(path.join(fullPath, `${locale}.md`), 'utf-8')
              const contentMatter = matter(contentData)
              content = contentMatter.content
              frontmatter = contentMatter.data
            } catch (err) {
              // 如果请求的语言文件不存在，获取所有可用的语言文件
              try {
                const files = await fs.readdir(fullPath)
                const mdFiles = files.filter(file => file.endsWith('.md'))
                
                if (mdFiles.length > 0) {
                  // 随机选择一个语言文件
                  const randomFile = mdFiles[Math.floor(Math.random() * mdFiles.length)]
                  const fallbackData = await fs.readFile(path.join(fullPath, randomFile), 'utf-8')
                  const fallbackMatter = matter(fallbackData)
                  content = fallbackMatter.content
                  frontmatter = fallbackMatter.data
                } else {
                  // 如果没有任何语言文件，跳过这个提示词
                  console.warn(`No content files found for ${fullPath}`)
                  continue
                }
              } catch (fallbackErr) {
                console.warn(`Error reading directory ${fullPath}:`, fallbackErr)
                continue
              }
            }

            // 如果是 AI 绘画类型，需要特殊处理
            if (type === 'ai-drawing') {
              const sections = content.split('#').filter(Boolean)
              const positive = sections.find(s => 
                s.includes('正面提示词') || 
                s.includes('Positive prompt')
              )?.split('\n').slice(1).join('\n').trim() || ''
              
              const negative = sections.find(s => 
                s.includes('负面提示词') || 
                s.includes('Negative prompt')
              )?.split('\n').slice(1).join('\n').trim() || ''
              
              const settingsSection = sections.find(s => 
                s.includes('参数设置') || 
                s.includes('Settings')
              )?.split('\n').slice(1) || []
              
              const settings = {
                steps: 20,
                cfg: 7,
                sampler: 'Euler a'
              }

              settingsSection.forEach(line => {
                const [key, value] = (line.replace('- ', '') || '').split(': ')
                if (key === 'Steps') settings.steps = parseInt(value) || 20
                if (key === 'CFG') settings.cfg = parseInt(value) || 7
                if (key === 'Sampler') settings.sampler = value || 'Euler a'
              })

              prompts.push({
                id: entry.name,
                title: frontmatter.title || '',
                description: frontmatter.description || '',
                content: content.trim(),
                author: metadata.author,
                authorUrl: metadata.authorUrl || null,
                category: parentDir,
                platforms: metadata.platforms,
                tags: metadata.tags,
                created: metadata.created,
                updated: metadata.updated,
                style: metadata.style || null,
                scene: metadata.scene || null,
                positive,
                negative,
                settings,
                preview: metadata.preview || null
              })
            } else {
              // 普通提示词
              prompts.push({
                id: entry.name,
                title: frontmatter.title || '',
                description: frontmatter.description || '',
                content: content.trim(),
                author: metadata.author,
                authorUrl: metadata.authorUrl || null,
                category: parentDir,
                platforms: metadata.platforms,
                tags: metadata.tags,
                created: metadata.created,
                updated: metadata.updated
              })
            }

            // console.log(prompts)
          } catch (err) {
            console.error(`Error processing prompt in ${fullPath}:`, err)
          }
        }
      }
    } catch (err) {
      console.error(`Error traversing directory ${dir}:`, err)
    }
  }

  await traverse(promptsDir)
  return prompts
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const promptsDir = path.join(process.cwd(), 'content/prompts')
    const metadataPath = path.join(promptsDir, slug, 'metadata.json')
    
    // 读取 metadata.json
    let metadata: Metadata = {
      author: 'Unknown',
      platforms: [],
      tags: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }

    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8')
      metadata = { ...metadata, ...JSON.parse(metadataContent) }
    } catch (err) {
      // 如果没有 metadata.json，使用默认值
    }

    // 尝试读取中文内容
    let content = ''
    let frontmatter: PromptFrontmatter = {}
    try {
      const zhPath = path.join(promptsDir, slug, 'zh.md')
      const zhContent = await fs.readFile(zhPath, 'utf-8')
      const zhMatter = matter(zhContent)
      content = zhMatter.content
      frontmatter = zhMatter.data
    } catch (err) {
      // 如果没有中文内容，尝试读取英文内容
      try {
        const enPath = path.join(promptsDir, slug, 'en.md')
        const enContent = await fs.readFile(enPath, 'utf-8')
        const enMatter = matter(enContent)
        content = enMatter.content
        frontmatter = enMatter.data
      } catch (enErr) {
        console.error(`No content found for ${slug}`)
        return null
      }
    }

    return {
      id: slug,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      content: content.trim(),
      author: metadata.author,
      authorUrl: metadata.authorUrl,
      category: metadata.category || 'other',
      platforms: metadata.platforms,
      tags: metadata.tags,
      created: metadata.created,
      updated: metadata.updated
    }
  } catch (err) {
    console.error(`Failed to load prompt: ${slug}`, err)
    return null
  }
}

export async function getPromptDetail(promptPath: string, locale: string = 'zh'): Promise<Prompt | null> {
  try {
    const [category, subcategory, name] = promptPath.split('/')
    const contentPath = path.join(process.cwd(), 'content', category, subcategory, name)
    
    // 读取元数据
    const metadataPath = path.join(contentPath, 'metadata.json')
    const metadataContent = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(metadataContent)
    
    // 尝试读取当前语言的内容
    let content = ''
    let frontmatter: PromptFrontmatter = {}
    
    try {
      // 首先尝试读取当前语言的文件
      const source = await fs.readFile(path.join(contentPath, `${locale}.md`), 'utf-8')
      const { data, content: mdContent } = matter(source)
      content = mdContent
      frontmatter = data
    } catch (err) {
      // 如果当前语言不存在，尝试其他语言
      try {
        const files = await fs.readdir(contentPath)
        const mdFiles = files.filter(file => file.endsWith('.md'))
        if (mdFiles.length > 0) {
          // 优先使用英文，如果没有则使用第一个找到的文件
          const fallbackFile = mdFiles.find(f => f === 'en.md') || mdFiles[0]
          const source = await fs.readFile(path.join(contentPath, fallbackFile), 'utf-8')
          const { data, content: mdContent } = matter(source)
          content = mdContent
          frontmatter = data
        }
      } catch (fallbackErr) {
        console.error('Error reading content files:', fallbackErr)
        return null
      }
    }

    // 如果是 AI 绘画类型，需要解析特殊格式
    if (category === 'ai-drawing') {
      const sections = content.split('#').filter(Boolean)
      const positive = sections.find(s => 
        s.includes('正面提示词') || 
        s.includes('Positive prompt')
      )?.split('\n').slice(1).join('\n').trim() || ''
      
      const negative = sections.find(s => 
        s.includes('负面提示词') || 
        s.includes('Negative prompt')
      )?.split('\n').slice(1).join('\n').trim() || ''
      
      const settingsSection = sections.find(s => 
        s.includes('参数设置') || 
        s.includes('Settings')
      )?.split('\n').slice(1) || []
      
      const settings = {
        steps: 20,
        cfg: 7,
        sampler: 'Euler a'
      }

      settingsSection.forEach(line => {
        const [key, value] = (line.replace('- ', '') || '').split(': ')
        if (key === 'Steps') settings.steps = parseInt(value) || 20
        if (key === 'CFG') settings.cfg = parseInt(value) || 7
        if (key === 'Sampler') settings.sampler = value || 'Euler a'
      })

      return {
        id: name,
        title: frontmatter.title || metadata.title || '',
        description: frontmatter.description || metadata.description || '',
        content: content.trim(),
        author: metadata.author,
        authorUrl: metadata.authorUrl || null,
        category: subcategory,
        platforms: metadata.platforms,
        tags: metadata.tags || [],
        created: metadata.created || new Date().toISOString(),
        updated: metadata.updated || new Date().toISOString(),
        style: metadata.style || null,
        scene: metadata.scene || null,
        positive,
        negative,
        settings,
        preview: metadata.preview || null
      }
    }
    
    // 普通提示词
    return {
      id: name,
      title: frontmatter.title || metadata.title || '',
      description: frontmatter.description || metadata.description || '',
      content: content.trim(),
      author: metadata.author,
      authorUrl: metadata.authorUrl || null,
      category: subcategory,
      platforms: metadata.platforms,
      tags: metadata.tags || [],
      created: metadata.created || new Date().toISOString(),
      updated: metadata.updated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting prompt detail:', error)
    return null
  }
} 