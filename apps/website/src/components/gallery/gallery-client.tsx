'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Recipe {
  id: string
  name: string
  description: string
  category: string
  colors: string[]
  tags: string[]
  image: string
}

interface Category {
  id: string
  name: string
  icon: string
}

interface GalleryClientProps {
  recipes: Recipe[]
  categories: Category[]
}

/**
 * Gallery 客户端组件 - 处理搜索、过滤和交互
 * 从服务端组件接收静态数据
 */
export function GalleryClient({ recipes, categories }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 过滤配方 - 纯客户端逻辑
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* 搜索和过滤 */}
      <div className="mb-8 space-y-4">
        {/* 搜索框 */}
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="搜索配方名称、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
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
                  {recipes.length}
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
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  )
}

/**
 * 配方卡片组件 - 内部组件
 */
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      <CardContent className="p-6">
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
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Link href={`/gallery/${recipe.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              查看详情
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="px-3">
            预览
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}