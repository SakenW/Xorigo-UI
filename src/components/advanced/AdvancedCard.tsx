import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'glass' | 'gradient' | 'neumorphic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period?: string
  }
  icon?: React.ReactNode
  variant?: CardProps['variant']
  size?: CardProps['size']
  loading?: boolean
  className?: string
}

export interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badge?: string
  actions?: {
    like?: () => void
    share?: () => void
    bookmark?: () => void
    view?: () => void
  }
  liked?: boolean
  bookmarked?: boolean
  loading?: boolean
  className?: string
}

export interface ArticleCardProps {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  image?: string
  tags?: string[]
  category?: string
  bookmarked?: boolean
  loading?: boolean
  className?: string
}

export interface CardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

// 基础卡片组件 (增强版)
export const AdvancedCard: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  loading = false,
  disabled = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const variantClasses = {
    default:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined:
      'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
    elevated:
      'bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 border-0',
    glass:
      'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg',
    gradient:
      'bg-linear-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 border-0 text-white',
    neumorphic:
      'bg-gray-100 dark:bg-gray-800 shadow-[-5px_-5px_10px_rgba(255,255,255,0.5),5px_5px_10px_rgba(0,0,0,0.1)] dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.3)] border-0',
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }

  const hoverClasses =
    hover && !disabled ? 'transition-all duration-300' : ''

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-xl overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : clickable
            ? 'cursor-pointer'
            : '',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={
        hover && !disabled && !loading
          ? {
              y: -4,
              scale: 1.02,
              transition: { duration: 0.2 },
            }
          : {}
      }
      whileTap={
        clickable && !disabled && !loading
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : {}
      }
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 加载遮罩 */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬停效果覆盖层 */}
      {hover && !disabled && !loading && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-black/10 dark:from-black/30 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      )}

      {children}
    </motion.div>
  )
}

AdvancedCard.displayName = 'AdvancedCard'

// 统计卡片组件
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  size = 'md',
  loading = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  const trendUpIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )

  const trendDownIcon = (
    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )

  return (
    <AdvancedCard
      variant={variant}
      size={size}
      hover={true}
      loading={loading}
      className={className}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <motion.p
            className={cn(
              'font-bold text-gray-900 dark:text-gray-100',
              sizeClasses[size]
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {loading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse" />
            ) : (
              value
            )}
          </motion.p>

          {change && (
            <motion.div
              className={cn(
                'flex items-center mt-2 text-sm',
                change.type === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {change.type === 'increase' ? trendUpIcon : trendDownIcon}
              <span className="ml-1">{Math.abs(change.value)}%</span>
              {change.period && (
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  {change.period}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {icon && (
          <motion.div
            className="ml-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-blue-600 dark:text-blue-400">{icon}</div>
          </motion.div>
        )}
      </div>
    </AdvancedCard>
  )
}

StatCard.displayName = 'StatCard'

// 产品卡片组件
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  badge,
  actions,
  liked = false,
  bookmarked = false,
  loading = false,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(liked)
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)

  const handleLike = () => {
    setIsLiked(!isLiked)
    actions?.like?.()
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    actions?.bookmark?.()
  }

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const heartIcon = <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
  const bookmarkIcon = <span className="text-xl">{isBookmarked ? '🔖' : '📑'}</span>
  const shareIcon = <span className="text-xl">🔗</span>

  return (
    <AdvancedCard
      variant="elevated"
      size="md"
      loading={loading}
      className={className}
    >
      {/* 产品图片 */}
      <div className="relative mb-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {loading ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
          ) : (
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* 徽章 */}
        {badge && (
          <motion.div
            className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {badge}
          </motion.div>
        )}

        {/* 折扣标签 */}
        {discountPercentage > 0 && (
          <motion.div
            className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            -{discountPercentage}%
          </motion.div>
        )}

        {/* 操作按钮 */}
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <motion.button
            onClick={handleLike}
            className="p-2 rounded-full backdrop-blur-xs bg-white/80 dark:bg-gray-800/80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {heartIcon}
          </motion.button>

          <motion.button
            onClick={handleBookmark}
            className="p-2 rounded-full backdrop-blur-xs bg-white/80 dark:bg-gray-800/80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {bookmarkIcon}
          </motion.button>
        </div>
      </div>

      {/* 产品信息 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* 评分 */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  'text-lg',
                  i < Math.floor(rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              >
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* 价格 */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ¥{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ¥{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 flex space-x-2">
        <motion.button
          onClick={() => actions?.view?.()}
          className="flex-1 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          查看详情
        </motion.button>

        <motion.button
          onClick={() => actions?.share?.()}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {shareIcon}
        </motion.button>
      </div>
    </AdvancedCard>
  )
}

ProductCard.displayName = 'ProductCard'

// 文章卡片组件
export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  description,
  author,
  publishedAt,
  readTime,
  image,
  tags = [],
  category,
  bookmarked = false,
  loading = false,
  className = '',
}) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const bookmarkIcon = <span className="text-xl">{isBookmarked ? '🔖' : '📑'}</span>

  return (
    <AdvancedCard
      variant="default"
      size="md"
      hover={true}
      loading={loading}
      className={className}
    >
      {/* 文章图片 */}
      {image && (
        <div className="relative mb-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {loading ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
            ) : (
              <motion.img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* 分类标签 */}
          {category && (
            <motion.div
              className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {category}
            </motion.div>
          )}

          {/* 书签按钮 */}
          <motion.button
            onClick={handleBookmark}
            className="absolute top-2 right-2 p-2 rounded-full backdrop-blur-xs bg-white/80 dark:bg-gray-800/80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {bookmarkIcon}
          </motion.button>
        </div>
      )}

      {/* 文章内容 */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-lg">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
          {description}
        </p>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* 元信息 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {author.name}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>📅 {publishedAt}</span>
            <span>⏱️ {readTime}分钟</span>
          </div>
        </div>
      </div>
    </AdvancedCard>
  )
}

ArticleCard.displayName = 'ArticleCard'

// 卡片网格组件
export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = '',
}) => {
  const columnsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  return (
    <div
      className={cn(
        'grid',
        columnsClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

CardGrid.displayName = 'CardGrid'
