import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

interface Props {
  category: string
  id: string
  locale: string
}

export default function AiDrawingPage({ category, id, locale }: Props) {
  const { t } = useTranslation('common')

  return (
    <div>
      <h1>{t('ai-drawing.title')}</h1>
      <p>Category: {category}</p>
      <p>ID: {id}</p>
      <p>Locale: {locale}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string
  const category = params?.category as string
  const id = params?.id as string

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      category,
      id,
      locale,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
} 