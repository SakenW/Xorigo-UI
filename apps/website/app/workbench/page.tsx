/**
 * Xorigo UI Workbench V2 - 集成版本
 * 基于 WorkbenchV2 统一架构的完整工作台
 *
 * 特性：
 * - 解决方案平台 (业务场景驱动)
 * - 组件库展示 (417组件注册系统)
 * - Monaco编辑器 (智能代码编辑)
 * - 主题系统 (七轴配方)
 * - 开发工具 (性能监控、调试)
 * - AI助手 (智能交互)
 */

'use client'

// 导入WorkbenchV2集成版本
import WorkbenchV2Integrated from './workbench-v2-integrated'

export default function WorkbenchPage() {
  // 直接使用集成版本的WorkbenchV2
  return <WorkbenchV2Integrated />
}