/**
 * 组件性能分析器
 * 提供实时性能监控、组件层次分析和性能瓶颈识别
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Pause,
  Play,
  BarChart3,
  List,
  Layers
} from 'lucide-react';
import { globalProfiler } from '../core/debug-engine';
import { PerformanceMetrics, PerformanceReport } from '../types/debug';

interface PerformanceProfilerProps {
  className?: string;
}

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
  className = ''
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isRecording, setIsRecording] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'hierarchy' | 'chart'>('timeline');
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetrics | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);

  // 获取性能数据
  const refreshMetrics = useCallback(() => {
    const newMetrics = globalProfiler.getMetrics();
    setMetrics(newMetrics);
    setPerformanceReport(globalProfiler.getPerformanceReport());
  }, []);

  // 自动刷新
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      refreshMetrics();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, refreshMetrics]);

  // 初始加载
  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  // 性能统计
  const performanceStats = useMemo(() => {
    if (!performanceReport) return null;

    return {
      totalMeasures: performanceReport.totalMeasures,
      averageTime: performanceReport.averageRenderTime.toFixed(2),
      slowComponentsCount: performanceReport.slowComponents.length,
      longTasksCount: performanceReport.longTasks.length,
      status: performanceReport.averageRenderTime < 16 ? 'good' :
              performanceReport.averageRenderTime < 33 ? 'warning' : 'poor'
    };
  }, [performanceReport]);

  // 格式化时间
  const formatDuration = (duration: number): string => {
    if (duration < 1) return `${(duration * 1000).toFixed(1)}ms`;
    if (duration < 1000) return `${duration.toFixed(1)}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  // 获取性能状态颜色
  const getPerformanceColor = (status: string): string => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // 渲染性能统计卡片
  const renderStatsCard = () => {
    if (!performanceStats) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            性能概览
          </h3>
          <div className={`flex items-center gap-2 ${getPerformanceColor(performanceStats.status)}`}>
            {performanceStats.status === 'good' && <CheckCircle className="w-5 h-5" />}
            {performanceStats.status === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {performanceStats.status === 'poor' && <TrendingUp className="w-5 h-5" />}
            <span className="text-sm font-medium capitalize">{performanceStats.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {performanceStats.totalMeasures}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">总测量次数</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {performanceStats.averageTime}ms
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">平均渲染时间</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {performanceStats.slowComponentsCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">慢组件</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {performanceStats.longTasksCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">长任务</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染时间轴视图
  const renderTimelineView = () => {
    const recentMetrics = metrics.slice(-20);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            时间轴视图
          </h4>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {recentMetrics.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              暂无性能数据
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedMetric === metric ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedMetric(metric)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          metric.type === 'component' ? 'bg-blue-500' :
                          metric.type === 'render' ? 'bg-green-500' :
                          metric.type === 'long-task' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {metric.name}
                        </span>
                        {metric.componentName && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({metric.componentName})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        metric.duration > 50 ? 'text-red-600 dark:text-red-400' :
                        metric.duration > 16 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {formatDuration(metric.duration)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {metric.type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染慢组件列表
  const renderSlowComponents = () => {
    if (!performanceReport?.slowComponents.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            慢组件分析
          </h4>
        </div>

        <div className="p-4">
          {performanceReport.slowComponents.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-2"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {component.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {component.type}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {formatDuration(component.duration)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  渲染时间
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染长任务列表
  const renderLongTasks = () => {
    if (!performanceReport?.longTasks.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            长任务分析
          </h4>
        </div>

        <div className="p-4">
          {performanceReport.longTasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                长任务 #{index + 1}
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatDuration(task.duration)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(task.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 控制栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          组件性能分析器
        </h2>

        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'hierarchy'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* 录制控制 */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRecording ? (
              <>
                <Pause className="w-4 h-4 inline mr-2" />
                暂停
              </>
            ) : (
              <>
                <Play className="w-4 h-4 inline mr-2" />
                开始
              </>
            )}
          </button>

          <button
            onClick={refreshMetrics}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            刷新
          </button>
        </div>
      </motion.div>

      {/* 性能统计卡片 */}
      {renderStatsCard()}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 时间轴视图 */}
        <div className="lg:col-span-2">
          {renderTimelineView()}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {renderSlowComponents()}
          {renderLongTasks()}
        </div>
      </div>

      {/* 选中指标的详细信息 */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                性能指标详情
              </h3>
              <button
                onClick={() => setSelectedMetric(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">名称</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedMetric.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">持续时间</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDuration(selectedMetric.duration)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">类型</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedMetric.type}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">时间戳</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(selectedMetric.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {selectedMetric.componentName && (
              <div className="mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">组件名称</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedMetric.componentName}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};