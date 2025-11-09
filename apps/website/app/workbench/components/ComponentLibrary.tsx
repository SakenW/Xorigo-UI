'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useComponentLibraryV2 } from '../hooks/useComponentLibraryV2'
import { ComponentPreviewThumbnail } from './ComponentPreviewThumbnail'
import ComponentDetails from './ComponentDetails'

// 分类按钮组件 - 使用 memo 优化
const CategoryButton = memo(({
  category,
  isSelected,
  onSelect
}: {
  category: any
  isSelected: boolean
  onSelect: (id: string) => void
}) => (
  <button
    onClick={() => onSelect(category.id)}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
      isSelected
        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="text-xl">{category.icon}</span>
      <div className="text-left">
        <div className="font-medium text-gray-900 dark:text-white">
          {category.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {category.description}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {category.componentCount}
      </span>
      <span className="text-gray-400">
        {isSelected ? '▼' : '▶'}
      </span>
    </div>
  </button>
))

CategoryButton.displayName = 'CategoryButton'

const ComponentLibrary = memo(function ComponentLibrary() {
  const {
    componentCategories,
    currentCategory,
    currentSubcategory,
    filteredComponents,
    totalComponentCount,
    selectedComponent,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    setSearchTerm,
    handleComponentClick,
    handleCloseDetails,
    handleCategorySelect,
    handleSubcategorySelect
  } = useComponentLibraryV2()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部统计 */}
      <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🧩 组件库中心
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              独立入口 {totalComponentCount} 个组件的专业展示厅
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalComponentCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">总组件数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航 */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              组件分类
            </h3>
            <div className="space-y-2">
              {componentCategories.map((category) => (
                <div key={category.id}>
                  <CategoryButton
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onSelect={handleCategorySelect}
                  />

                  {/* 子分类 */}
                  {selectedCategory === category.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleSubcategorySelect(category.id, subcategory.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                            selectedSubcategory === subcategory.id
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>📄</span>
                            <div className="text-left">
                              <div className="text-sm font-medium">
                                {subcategory.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {subcategory.description}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {subcategory.components.length}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧组件列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 当前路径 */}
          <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>组件库</span>
            {currentCategory && (
              <>
                <span>/</span>
                <span>{currentCategory.name}</span>
              </>
            )}
            {currentSubcategory && (
              <>
                <span>/</span>
                <span>{currentSubcategory.name}</span>
              </>
            )}
          </div>

          {/* 组件网格 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredComponents.map((component) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.random() * 0.1 // 随机延迟创造自然的加载效果
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleComponentClick(component)}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* 顶部：组件视觉预览区域 */}
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center h-24">
                    {/* 渲染组件的缩略预览 */}
                    <ComponentPreviewThumbnail componentName={component.name} />
                  </div>
                </div>

                {/* 中部：组件信息 */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {component.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {component.element}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {component.usage}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-xs line-clamp-2">
                    {component.description}
                  </p>

                  {/* Props 标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {component.props?.slice(0, 2).map((prop, index) => (
                      <span
                        key={`${component.id}-prop-${prop}-${index}`}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                      >
                        {prop}
                      </span>
                    ))}
                    {component.props && component.props.length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                        +{component.props.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* 底部：标签和操作按钮 */}
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {component.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={`${component.id}-tag-${tag}`}
                          className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComponentClick(component);
                        }}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        预览
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // 这里可以添加查看文档的逻辑
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        文档
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 空状态 */}
          {filteredComponents.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg">没有找到匹配的组件</p>
              <p className="text-sm mt-2">尝试调整搜索条件或选择其他分类</p>
            </div>
          )}
        </div>
      </div>

      {/* 组件详情弹窗 */}
      {selectedComponent && (
        <ComponentDetails
          component={selectedComponent}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
})

ComponentLibrary.displayName = 'ComponentLibrary'

export default ComponentLibrary