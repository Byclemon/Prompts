import { appWithTranslation } from 'next-i18next'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import nextI18NextConfig from '../../next-i18next.config.js'
import '@/styles/globals.css'

type AppPropsWithLayout = AppProps & {
  Component: {
    getLayout?: (page: React.ReactElement) => React.ReactNode
  }
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Component {...pageProps} />
      <Toaster position="bottom-center" />
    </ThemeProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig) 