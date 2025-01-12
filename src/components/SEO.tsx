import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  noindex?: boolean
  nofollow?: boolean
  publishedTime?: string
  modifiedTime?: string
}

// 网站配置
const SITE_CONFIG = {
  domain: 'prompts.byclemon.com', // 实际域名
  author: 'byclemon'
}

export function SEO({
  title,
  description,
  keywords,
  image = '/og-image.png',
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const router = useRouter()
  const locale = router.locale || 'zh'
  
  const defaultTitle = locale === 'zh' ? 'AI 提示词库 - 精选提示词分享平台' : 'AI Prompts Library - Selected Prompts Sharing Platform'
  
  // 优化中文描述
  const defaultDescriptionZh = '专业的AI提示词分享平台，收录海量ChatGPT提示词、Midjourney绘画提示词、Stable Diffusion提示词、AI编程提示词。助您掌握AI工具的精髓，提高工作效率。支持中英双语，提供免费的AI提示词下载和分享功能。'
  
  // 优化英文描述
  const defaultDescriptionEn = 'Professional AI prompts sharing platform featuring a vast collection of prompts for ChatGPT, Midjourney, Stable Diffusion, and AI programming. Master AI tools, boost productivity with our bilingual platform. Free download and sharing available.'
  
  // 优化中文关键词
  const defaultKeywordsZh = 'AI提示词,ChatGPT提示词,Midjourney提示词,Stable Diffusion提示词,AI绘画提示词,AI编程助手,AI提示词下载,AI提示词分享,人工智能提示词,AI助手,AI工具,AI应用,提示词优化,提示词技巧,AI教程,人工智能应用'
  
  // 优化英文关键词
  const defaultKeywordsEn = 'AI prompts,ChatGPT prompts,Midjourney prompts,Stable Diffusion prompts,AI art prompts,AI programming assistant,AI prompts download,AI prompts sharing,artificial intelligence prompts,AI assistant,AI tools,AI applications,prompt engineering,prompt techniques,AI tutorials'

  const siteTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
  const metaDescription = description || (locale === 'zh' ? defaultDescriptionZh : defaultDescriptionEn)
  const metaKeywords = keywords || (locale === 'zh' ? defaultKeywordsZh : defaultKeywordsEn)
  const canonical = `https://${SITE_CONFIG.domain}${router.asPath}`
  const siteAuthor = 'byclemon'

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* 基本元数据 */}
      <meta name="author" content={siteAuthor} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="renderer" content="webkit" />
      <meta name="format-detection" content="telephone=no,email=no,address=no" />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale === 'zh' ? 'zh_CN' : 'en_US'} />
      <meta property="og:site_name" content={defaultTitle} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* 百度 */}
      <meta name="baidu-site-verification" content="code-YOUR_BAIDU_CODE" />
      <meta property="og:baidu:title" content={siteTitle} />
      <meta property="og:baidu:description" content={metaDescription} />
      <meta property="og:baidu:image" content={image} />
      
      {/* 必应 */}
      <meta name="msvalidate.01" content="YOUR_BING_CODE" />
      
      {/* 谷歌 */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_CODE" />
      
      {/* Canonical & Robots */}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'},max-snippet:-1,max-image-preview:large,max-video-preview:-1`} />
      
      {/* Alternate Languages */}
      <link rel="alternate" href={`https://${SITE_CONFIG.domain}${router.asPath}`} hrefLang="x-default" />
      <link rel="alternate" href={`https://${SITE_CONFIG.domain}${router.asPath}`} hrefLang="zh" />
      <link rel="alternate" href={`https://${SITE_CONFIG.domain}/en${router.asPath}`} hrefLang="en" />
      
      {/* Mobile Theme */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* PWA */}
      <meta name="application-name" content="Prompts" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Prompts" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />
    </Head>
  )
} 