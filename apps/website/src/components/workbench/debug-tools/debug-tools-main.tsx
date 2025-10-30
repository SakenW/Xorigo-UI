/**
 * 调试工具主入口组件
 * 集成所有调试功能，提供统一的调试界面
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  GitBranch,
  Bug,
  Zap,
  Settings,
  Monitor,
  Download,
  HelpCircle,
  ChevronRight,
  Shield
} from 'lucide-react';
import { PerformanceProfiler } from './performance/performance-profiler';
import { DependencyVisualizer } from './dependency/dependency-visualizer';
import { ErrorBoundaryDetector, DebugErrorBoundary } from './error/error-boundary-detector';
import { HotReloadMonitor } from './hot-reload/hot-reload-monitor';
import { DebugToolsTest } from './test/debug-tools-test';

export type DebugToolType = 'performance' | 'dependency' | 'error' | 'hot-reload' | 'test';

interface DebugTool {
  id: DebugToolType;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ className?: string }>;
  badge?: string;
  color: string;
}

const debugTools: DebugTool[] = [
  {
    id: 'performance',
    name: '性能分析器',
    description: '实时监控组件性能，识别渲染瓶颈',
    icon: <Activity className="w-5 h-5" />,
    component: PerformanceProfiler,
    color: 'blue'
  },
  {
    id: 'dependency',
    name: '依赖关系可视化',
    description: '分析组件依赖关系，检测循环依赖',
    icon: <GitBranch className="w-5 h-5" />,
    component: DependencyVisualizer,
    color: 'green'
  },
  {
    id: 'error',
    name: '错误边界检测',
    description: '自动捕获和分类错误，提供修复建议',
    icon: <Bug className="w-5 h-5" />,
    component: ErrorBoundaryDetector,
    color: 'red',
    badge: 'Beta'
  },
  {
    id: 'hot-reload',
    name: '热重载监控',
    description: '监控热重载性能，优化开发体验',
    icon: <Zap className="w-5 h-5" />,
    component: HotReloadMonitor,
    color: 'yellow'
  },
  {
    id: 'test',
    name: '功能测试',
    description: '测试调试工具的各项功能',
    icon: <Settings className="w-5 h-5" />,
    component: DebugToolsTest,
    color: 'purple',
    badge: 'Test'
  }
];

interface DebugToolsMainProps {
  className?: string;
  initialTool?: DebugToolType;
}

export const DebugToolsMain: React.FC<DebugToolsMainProps> = ({
  className = '',
  initialTool = 'performance'
}) => {
  const [activeTool, setActiveTool] = useState<DebugToolType>(initialTool);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentTool = debugTools.find(tool => tool.id === activeTool);
  const CurrentToolComponent = currentTool?.component;

  // 导出调试报告
  const exportDebugReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      activeTool,
      tools: debugTools.map(tool => ({
        id: tool.id,
        name: tool.name,
        status: 'available'
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeTool]);

  // 获取工具颜色样式
  const getToolColorClass = (color: string, isActive: boolean) => {
    const baseColors = {
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      red: isActive ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      purple: isActive ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    };

    return baseColors[color as keyof typeof baseColors] || baseColors.blue;
  };

  return (
    <DebugErrorBoundary componentName="DebugToolsMain">
      <div className={`space-y-6 ${className}`}>
        {/* 头部导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-indigo-500" />
                  高级调试工具
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Phase 3.3 - 专业的组件调试和性能分析工具集
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportDebugReport}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出报告
                </button>

                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 工具选择器 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {debugTools.map((tool) => (
                <motion.button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeTool === tool.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${getToolColorClass(tool.color, activeTool === tool.id)}`}>
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activeTool === tool.id ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      activeTool === tool.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 当前工具界面 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentToolComponent && (
              <CurrentToolComponent className="mb-6" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* 设置面板 */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  调试工具设置
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 性能设置 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        性能分析设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">自动记录性能指标</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">显示组件渲染时间</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">监控长任务</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>

                    {/* 错误设置 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        错误检测设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">自动错误边界包装</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">记录控制台错误</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">发送错误报告</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>

                    {/* 热重载设置 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        热重载设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">监控热重载性能</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">显示重载日志</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">保持组件状态</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>

                    {/* 通用设置 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        通用设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">深色模式</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">显示工具提示</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">自动刷新数据</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      保存设置
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 帮助提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">
                调试工具使用提示
              </h4>
              <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <li>• 使用性能分析器监控组件渲染时间和识别性能瓶颈</li>
                <li>• 依赖关系可视化帮助理解组件间的依赖结构</li>
                <li>• 错误边界检测自动捕获并分类运行时错误</li>
                <li>• 热重载监控优化开发体验和重载性能</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 安全提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                隐私和安全
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                所有调试数据仅在本地存储，不会发送到外部服务器。您可以在设置中控制数据收集和导出行为。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DebugErrorBoundary>
  );
};