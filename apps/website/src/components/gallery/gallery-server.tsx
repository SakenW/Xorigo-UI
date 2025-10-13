import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GalleryClient } from './gallery-client'

// 模拟配方数据 - 在实际项目中可以从 API 或数据库获取
const mockRecipes = [
  {
    id: 'modern-ocean',
    name: 'Modern Ocean',
    description: '现代海洋风格，适合科技类产品',
    category: 'technology',
    colors: ['#0EA5E9', '#0284C7', '#0C4A6E', '#075985'],
    tags: ['blue', 'modern', 'professional'],
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop'
  },
  {
    id: 'sunset-warmth',
    name: 'Sunset Warmth',
    description: '温暖日落色调，适合生活类应用',
    category: 'lifestyle',
    colors: ['#F97316', '#EA580C', '#DC2626', '#B91C1C'],
    tags: ['orange', 'warm', 'vibrant'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  },
  {
    id: 'forest-serenity',
    name: 'Forest Serenity',
    description: '森林宁静风格，适合环保类项目',
    category: 'nature',
    colors: ['#16A34A', '#15803D', '#166534', '#14532D'],
    tags: ['green', 'nature', 'calm'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop'
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: '午夜紫色调，适合创意类作品',
    category: 'creative',
    colors: ['#9333EA', '#7C3AED', '#6D28D9', '#5B21B6'],
    tags: ['purple', 'creative', 'mysterious'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop'
  },
  {
    id: 'coral-breeze',
    name: 'Coral Breeze',
    description: '珊瑚清新风格，适合女性化产品',
    category: 'fashion',
    colors: ['#FB7185', '#F43F5E', '#E11D48', '#BE123C'],
    tags: ['pink', 'coral', 'fashion'],
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=250&fit=crop'
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    description: '极地霜白风格，适合极简设计',
    category: 'minimal',
    colors: ['#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8'],
    tags: ['blue', 'minimal', 'clean'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  }
]

const categories = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'technology', name: '科技', icon: '💻' },
  { id: 'lifestyle', name: '生活', icon: '🌿' },
  { id: 'nature', name: '自然', icon: '🌳' },
  { id: 'creative', name: '创意', icon: '✨' },
  { id: 'fashion', name: '时尚', icon: '👗' },
  { id: 'minimal', name: '极简', icon: '⚪' }
]

/**
 * Gallery 服务端组件 - 处理数据获取和静态内容
 * 搜索和过滤功能委托给客户端组件
 */
export function GalleryServer() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 - 纯静态内容 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          配方展示画廊
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          探索精心设计的七轴 DTCG 配方，一键切换，实时预览，让设计更加精彩
        </p>
      </div>

      {/* 搜索和过滤 - 委托给客户端组件 */}
      <GalleryClient
        recipes={mockRecipes}
        categories={categories}
      />

      {/* 底部统计 - 静态数据 */}
      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              {mockRecipes.length}
            </span>
            <span className="ml-1">个精选配方</span>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              {categories.length - 1}
            </span>
            <span className="ml-1">个分类</span>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              ∞
            </span>
            <span className="ml-1">种组合可能</span>
          </div>
        </div>
      </div>
    </div>
  )
}