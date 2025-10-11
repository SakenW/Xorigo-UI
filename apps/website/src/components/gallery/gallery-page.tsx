'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid3X3, List } from 'lucide-react'
import { Input } from '@th-ui/core'
import { Button } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@th-ui/core'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@th-ui/core'
import { RecipeCard } from './recipe-card'
import { RecipePreview } from './recipe-preview'
import { recipes } from '@/data/recipes'
import { categories, densities, tones, surfaces, modes } from '@/data/recipe-filters'

export function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [selectedDensity, setSelectedDensity] = useState('all')
  const [selectedTone, setSelectedTone] = useState('all')
  const [selectedSurface, setSelectedSurface] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)

  // 过滤配方
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
      const matchesMode = selectedMode === 'all' || recipe.mode === selectedMode
      const matchesDensity = selectedDensity === 'all' || recipe.density === selectedDensity
      const matchesTone = selectedTone === 'all' || recipe.tone === selectedTone
      const matchesSurface = selectedSurface === 'all' || recipe.surface === selectedSurface

      return matchesSearch && matchesCategory && matchesMode && matchesDensity && matchesTone && matchesSurface
    })
  }, [searchQuery, selectedCategory, selectedMode, selectedDensity, selectedTone, selectedSurface])

  const selectedRecipeData = recipes.find(recipe => recipe.id === selectedRecipe)

  return (
    <div className="container mx-auto py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">样式配方库</h1>
        <p className="text-lg text-muted-foreground">
          探索 TH-UI 七轴样式配方系统，找到最适合您项目的设计风格
        </p>
      </div>

      {/* 预览区域 */}
      {selectedRecipeData && (
        <div className="mb-8">
          <RecipePreview
            recipe={selectedRecipeData}
            onClose={() => setSelectedRecipe(null)}
          />
        </div>
      )}

      {/* 搜索和过滤 */}
      <div className="mb-8 space-y-4">
        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索配方名称、描述或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">过滤:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类别</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMode} onValueChange={setSelectedMode}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有模式</SelectItem>
              {modes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDensity} onValueChange={setSelectedDensity}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="密度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有密度</SelectItem>
              {densities.map(density => (
                <SelectItem key={density.value} value={density.value}>
                  {density.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="色调" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有色调</SelectItem>
              {tones.map(tone => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSurface} onValueChange={setSelectedSurface}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="表面" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有表面</SelectItem>
              {surfaces.map(surface => (
                <SelectItem key={surface.value} value={surface.value}>
                  {surface.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 活跃过滤器 */}
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              搜索: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
          {(selectedCategory !== 'all' ||
            selectedMode !== 'all' ||
            selectedDensity !== 'all' ||
            selectedTone !== 'all' ||
            selectedSurface !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all')
                setSelectedMode('all')
                setSelectedDensity('all')
                setSelectedTone('all')
                setSelectedSurface('all')
              }}
            >
              清除过滤器
            </Button>
          )}
        </div>
      </div>

      {/* 结果统计 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          找到 {filteredRecipes.length} 个配方
        </p>
      </div>

      {/* 配方网格 */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">没有找到匹配的配方</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedMode('all')
              setSelectedDensity('all')
              setSelectedTone('all')
              setSelectedSurface('all')
            }}
          >
            重置搜索
          </Button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              viewMode={viewMode}
              onClick={() => setSelectedRecipe(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}