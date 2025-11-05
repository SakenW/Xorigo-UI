/**
 * Workbench 页面 - 2.0 统一架构版本
 * 基于混合架构模式：业务层 → 组合层 → 原子层 → 基础层
 * 整合解决方案平台、组件库展示、编辑器、主题配置器
 */

import { Metadata } from 'next'
import WorkbenchV2 from '@/components/workbench/WorkbenchV2'
import { ComponentRegistryProvider } from '@/components/workbench/ComponentRegistry'

export const metadata: Metadata = {
  title: 'Workbench 2.0 - Xorigo UI | 组件开发工作台',
  description: '基于业务场景的组件解决方案平台，支持实时预览、代码编辑和主题配置',
}

export default function WorkbenchPage() {
  return (
    <ComponentRegistryProvider autoLoad={true}>
      <WorkbenchV2
        initialMode="solution"
        onSave={(data) => {
          console.log('Workbench save:', data)
        }}
      />
    </ComponentRegistryProvider>
  )
}