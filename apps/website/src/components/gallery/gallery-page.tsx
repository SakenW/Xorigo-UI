'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import { Button } from '@th-ui/core'
import Link from 'next/link'

// 模拟配方数据
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

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 过滤配方
  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          配方展示画廊
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          探索精心设计的七轴 DTCG 配方，一键切换，实时预览，让设计更加精彩
        </p>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-8 space-y-4">
        {/* 搜索框 */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="搜索配方名称、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* 分类过滤 */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              {category.id === 'all' && (
                <Badge variant="default" className="ml-2 text-xs">
                  {mockRecipes.length}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 配方网格 */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            没有找到匹配的配方
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            尝试调整搜索关键词或选择其他分类
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} variant="elevated" hoverable className="group">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <CardContent>
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {recipe.name}
                    </h3>
                    <Badge variant="default" className="text-xs">
                      {recipe.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                {/* 配色预览 */}
                <div className="mb-4">
                  <div className="flex gap-1">
                    {recipe.colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 h-8 rounded"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Link href={`/gallery/${recipe.id}`}>
                    <Button className="flex-1" size="sm">
                      查看详情
                    </Button>
                  </Link>
                  <Button variant="primary" size="sm" className="px-3">
                    预览
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 底部统计 */}
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

export default GalleryPage