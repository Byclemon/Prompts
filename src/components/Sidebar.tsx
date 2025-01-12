import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

interface SidebarProps {
  categories: ReadonlyArray<{ readonly id: string; readonly icon: string }>
  selectedCategory: string
  onCategoryClick: (id: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  isMobileOpen: boolean
  onMobileClose: () => void
  categoryNamePrefix?: string
}

export function Sidebar({
  categories,
  selectedCategory,
  onCategoryClick,
  searchQuery,
  onSearchChange,
  isMobileOpen,
  onMobileClose,
  categoryNamePrefix = 'categories'
}: SidebarProps) {
  const { t } = useTranslation('common')

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          placeholder={t('home.searchPlaceholder')}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2 p-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`w-full px-4 py-2.5 rounded-xl transition-colors flex items-center gap-3 text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{t(`${categoryNamePrefix}.${category.id}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4 pb-4">
        <Link href="/submit" className="block">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <span>✨</span>
            <span>{t('home.shareButton')}</span>
          </motion.button>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
          {sidebarContent}
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 