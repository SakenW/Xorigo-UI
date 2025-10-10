import React, { useState } from 'react'
import { ThemeToggle } from '../../src/components/ThemeToggle'
import { ToastProvider } from '../../src/components/Notification'
import ButtonDemo from '../components/forms/ButtonDemo'
import InputDemo from '../components/forms/InputDemo'
import CheckboxDemo from '../components/forms/CheckboxDemo'
import SelectDemo from '../components/forms/SelectDemo'
import AlertDemo from '../components/feedback/AlertDemo'
import NotificationDemo from '../components/feedback/NotificationDemo'
import LoadingDemo from '../components/feedback/LoadingDemo'
import ModalDemo from '../components/feedback/ModalDemo'
import DataTableDemo from '../components/data/DataTableDemo'
import BreadcrumbDemo from '../components/navigation/BreadcrumbDemo'
import HeaderDemo from '../components/navigation/HeaderDemo'
import SidebarDemo from '../components/navigation/SidebarDemo'
import CardDemo from '../components/layout/CardDemo'
import AdvancedCardDemo from '../components/layout/AdvancedCardDemo'
import ThemeDemo from '../components/advanced/ThemeDemo'
import ThemeToggleDemo from '../components/advanced/ThemeToggleDemo'
import AnimatedCardDemo from '../components/advanced/AnimatedCardDemo'
import MicroInteractionsDemo from '../components/advanced/MicroInteractionsDemo'
import ResponsiveLayoutDemo from '../components/layout/ResponsiveLayoutDemo'
import InteractionStatesDemo from '../components/advanced/InteractionStatesDemo'
import TooltipDemo from '../components/feedback/TooltipDemo'
import BadgeDemo from '../components/data/BadgeDemo'
import TabsDemo from '../components/navigation/TabsDemo'
import SwitchDemo from '../components/forms/SwitchDemo'
import AvatarDemo from '../components/data/AvatarDemo'
import DividerDemo from '../components/layout/DividerDemo'
import ProgressDemo from '../components/feedback/ProgressDemo'
import PaginationDemo from '../components/navigation/PaginationDemo'
import RadioDemo from '../components/forms/RadioDemo'
import TextareaDemo from '../components/forms/TextareaDemo'
import SkeletonDemo from '../components/feedback/SkeletonDemo'

const categories = [
  {
    id: 'forms',
    name: '表单组件',
    icon: '📝',
    components: ['Button', 'Input', 'Checkbox', 'Select']
  },
  {
    id: 'feedback',
    name: '反馈组件',
    icon: '💬',
    components: ['Alert', 'Notification', 'Loading', 'Modal']
  },
  {
    id: 'data',
    name: '数据展示',
    icon: '📊',
    components: ['DataTable', 'Card', 'Badge', 'Progress']
  },
  {
    id: 'navigation',
    name: '导航组件',
    icon: '🧭',
    components: ['Breadcrumb', 'Tabs', 'Pagination']
  },
  {
    id: 'layout',
    name: '布局组件',
    icon: '📐',
    components: ['Grid', 'Flex', 'Container']
  },
  {
    id: 'advanced',
    name: '高级组件',
    icon: '🚀',
    components: ['ThemeToggle', 'AnimatedCard', 'Micro Interactions']
  }
]

function ComponentLibraryContent() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                TH-UI 组件库
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                31个组件演示 | 30个组件 | 10种主题 | React 19 + TypeScript + Tailwind CSS 3
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🎯 全部组件
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Forms Section */}
        {(activeCategory === 'all' || activeCategory === 'forms') && (
          <>
            <ButtonDemo />
            <InputDemo />
            <CheckboxDemo />
            <SelectDemo />
            <SwitchDemo />
            <RadioDemo />
            <TextareaDemo />
          </>
        )}

        {/* Feedback Section */}
        {(activeCategory === 'all' || activeCategory === 'feedback') && (
          <>
            <AlertDemo />
            <NotificationDemo />
            <LoadingDemo />
            <ModalDemo />
            <TooltipDemo />
            <ProgressDemo />
            <SkeletonDemo />
          </>
        )}

        {/* Data Section */}
        {(activeCategory === 'all' || activeCategory === 'data') && (
          <>
            <DataTableDemo />
            <BadgeDemo />
            <AvatarDemo />
          </>
        )}

        {/* Navigation Section */}
        {(activeCategory === 'all' || activeCategory === 'navigation') && (
          <>
            <BreadcrumbDemo />
            <HeaderDemo />
            <SidebarDemo />
            <TabsDemo />
            <PaginationDemo />
          </>
        )}

        {/* Layout Section */}
        {(activeCategory === 'all' || activeCategory === 'layout') && (
          <>
            <CardDemo />
            <AdvancedCardDemo />
            <ResponsiveLayoutDemo />
            <DividerDemo />
          </>
        )}

        {/* Advanced Section */}
        {(activeCategory === 'all' || activeCategory === 'advanced') && (
          <>
            <ThemeDemo />
            <ThemeToggleDemo />
            <AnimatedCardDemo />
            <MicroInteractionsDemo />
            <InteractionStatesDemo />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            TH-UI v0.1.0 | 基于 Trans-Hub 设计系统 |
            <span className="mx-2">•</span>
            30个组件已迁移
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function ComponentLibrary() {
  return (
    <ToastProvider>
      <ComponentLibraryContent />
    </ToastProvider>
  )
}
