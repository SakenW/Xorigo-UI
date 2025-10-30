/**
 * 热重载监控器
 * 提供组件状态保持、热重载性能分析、增量更新监控等功能
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Activity,
  Clock,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Settings,
  BarChart3,
  Layers,
  Code,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { globalHotReloadMonitor } from '../core/debug-engine';
import { HotReloadMetrics, HotReloadReport } from '../types/debug';

// 热重载模拟器
class HotReloadSimulator {
  private listeners: Array<(metrics: HotReloadMetrics) => void> = [];
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.componentNames = [
      'Header', 'Footer', 'Sidebar', 'Button', 'Input', 'Modal', 'Card',
      'Navigation', 'UserProfile', 'DataTable', 'Chart', 'Form', 'Tooltip'
    ];
    this.reloadReasons = ['component-update', 'style-change', 'props-change', 'effect-update'];
  }

  private componentName: string[] = [];
  private reloadReasons: string[] = [];

  public addListener(listener: (metrics: HotReloadMetrics) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (metrics: HotReloadMetrics) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.interval = setInterval(() => {
      const metrics: HotReloadMetrics = {
        componentName: this.componentNames[Math.floor(Math.random() * this.componentNames.length)],
        reloadTime: Math.random() * 100 + 10, // 10-110ms
        timestamp: Date.now(),
        reason: this.reloadReasons[Math.floor(Math.random() * this.reloadReasons.length)],
        type: 'component-update'
      };

      globalHotReloadMonitor.recordReload(
        metrics.componentName,
        metrics.reloadTime,
        metrics.reason
      );

      this.listeners.forEach(listener => listener(metrics));
    }, Math.random() * 3000 + 1000); // 1-4秒随机间隔
  }

  public stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public simulateManualReload(componentName: string) {
    const metrics: HotReloadMetrics = {
      componentName,
      reloadTime: Math.random() * 50 + 5,
      timestamp: Date.now(),
      reason: 'manual-reload',
      type: 'component-update'
    };

    globalHotReloadMonitor.recordReload(componentName, metrics.reloadTime, metrics.reason);
    this.listeners.forEach(listener => listener(metrics));
  }
}

interface HotReloadMonitorProps {
  className?: string;
}

export const HotReloadMonitor: React.FC<HotReloadMonitorProps> = ({
  className = ''
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hotReloadReport, setHotReloadReport] = useState<HotReloadReport | null>(null);
  const [recentReloads, setRecentReloads] = useState<HotReloadMetrics[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<HotReloadMetrics | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const simulatorRef = useRef<HotReloadSimulator | null>(null);

  // 初始化模拟器
  useEffect(() => {
    simulatorRef.current = new HotReloadSimulator();

    const handleMetricsUpdate = (metrics: HotReloadMetrics) => {
      setRecentReloads(prev => [metrics, ...prev.slice(0, 19)]); // 保留最近20条
    };

    if (simulatorRef.current) {
      simulatorRef.current.addListener(handleMetricsUpdate);
    }

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.removeListener(handleMetricsUpdate);
        simulatorRef.current.stop();
      }
    };
  }, []);

  // 自动刷新报告
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const report = globalHotReloadMonitor.getHotReloadReport();
      setHotReloadReport(report);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 监控控制
  const toggleMonitoring = () => {
    if (!simulatorRef.current) return;

    if (isMonitoring) {
      simulatorRef.current.stop();
    } else {
      simulatorRef.current.start();
    }
    setIsMonitoring(!isMonitoring);
  };

  // 手动触发重载
  const simulateReload = (componentName: string) => {
    simulatorRef.current?.simulateManualReload(componentName);
  };

  // 清除数据
  const clearData = () => {
    globalHotReloadMonitor.clearMetrics();
    setRecentReloads([]);
    setHotReloadReport(null);
    setSelectedMetric(null);
  };

  // 格式化时间
  const formatDuration = (duration: number): string => {
    if (duration < 1) return `${(duration * 1000).toFixed(1)}ms`;
    return `${duration.toFixed(1)}ms`;
  };

  // 获取重载原因颜色
  const getReasonColor = (reason: string): string => {
    switch (reason) {
      case 'component-update': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'style-change': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'props-change': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'effect-update': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'manual-reload': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // 获取性能状态
  const getPerformanceStatus = (avgTime: number): { status: string; color: string; icon: React.ReactNode } => {
    if (avgTime < 20) {
      return {
        status: 'excellent',
        color: 'text-green-600 dark:text-green-400',
        icon: <CheckCircle className="w-5 h-5" />
      };
    } else if (avgTime < 50) {
      return {
        status: 'good',
        color: 'text-blue-600 dark:text-blue-400',
        icon: <CheckCircle className="w-5 h-5" />
      };
    } else if (avgTime < 100) {
      return {
        status: 'slow',
        color: 'text-yellow-600 dark:text-yellow-400',
        icon: <AlertTriangle className="w-5 h-5" />
      };
    } else {
      return {
        status: 'problematic',
        color: 'text-red-600 dark:text-red-400',
        icon: <AlertTriangle className="w-5 h-5" />
      };
    }
  };

  const performanceStatus = hotReloadReport ? getPerformanceStatus(hotReloadReport.averageReloadTime) : null;

  // 渲染统计卡片
  const renderStatsCard = () => {
    if (!hotReloadReport) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            热重载统计
          </h3>
          {performanceStatus && (
            <div className={`flex items-center gap-2 ${performanceStatus.color}`}>
              {performanceStatus.icon}
              <span className="text-sm font-medium capitalize">{performanceStatus.status}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {hotReloadReport.totalReloads}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">总重载次数</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatDuration(hotReloadReport.averageReloadTime)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">平均重载时间</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hotReloadReport.reloadFrequency.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">重载频率/分钟</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {hotReloadReport.mostReloadedComponents.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">活跃组件</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染实时日志
  const renderLiveLog = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            实时重载日志
          </h4>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isMonitoring ? '监控中' : '已暂停'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {recentReloads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>等待热重载事件...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentReloads.map((metric, index) => (
              <motion.div
                key={`${metric.timestamp}-${index}`}
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {metric.componentName}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getReasonColor(metric.reason)}`}>
                        {metric.reason}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      metric.reloadTime > 50 ? 'text-red-600 dark:text-red-400' :
                      metric.reloadTime > 20 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {formatDuration(metric.reloadTime)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      重载时间
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

  // 渲染热力图
  const renderHeatmap = () => {
    if (!hotReloadReport?.mostReloadedComponents.length) return null;

    const maxCount = Math.max(...hotReloadReport.mostReloadedComponents.map(c => c.count));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-500" />
          组件热力图
        </h4>

        <div className="space-y-3">
          {hotReloadReport.mostReloadedComponents.slice(0, 10).map((component, index) => {
            const intensity = component.count / maxCount;
            const barColor = intensity > 0.8 ? 'bg-red-500' :
                           intensity > 0.6 ? 'bg-orange-500' :
                           intensity > 0.4 ? 'bg-yellow-500' :
                           intensity > 0.2 ? 'bg-green-500' : 'bg-blue-500';

            return (
              <div key={component.name} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {component.name}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${intensity * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-full ${barColor} rounded-full`}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {component.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // 渲染手动控制面板
  const renderControlPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4 text-gray-500" />
        手动控制
      </h4>

      <div className="space-y-4">
        {/* 快速重载按钮 */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">快速重载测试</div>
          <div className="grid grid-cols-3 gap-2">
            {['Button', 'Input', 'Modal', 'Card', 'Header', 'Footer'].map(component => (
              <button
                key={component}
                onClick={() => simulateReload(component)}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                {component}
              </button>
            ))}
          </div>
        </div>

        {/* 设置选项 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">自动刷新</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoRefresh ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* 清除数据 */}
        <button
          onClick={clearData}
          className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          清除所有数据
        </button>
      </div>
    </motion.div>
  );

  // 渲染选中指标的详细信息
  const renderMetricDetails = () => {
    if (!selectedMetric) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            重载详情
          </h3>
          <button
            onClick={() => setSelectedMetric(null)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">组件名称</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {selectedMetric.componentName}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">重载时间</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {formatDuration(selectedMetric.reloadTime)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">重载原因</div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getReasonColor(selectedMetric.reason)}`}>
                {selectedMetric.reason}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">时间戳</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(selectedMetric.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">性能分析</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">状态</span>
                <span className={`font-medium ${
                  selectedMetric.reloadTime > 50 ? 'text-red-600 dark:text-red-400' :
                  selectedMetric.reloadTime > 20 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {selectedMetric.reloadTime > 50 ? '需要优化' :
                   selectedMetric.reloadTime > 20 ? '可接受' : '优秀'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">建议</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {selectedMetric.reloadTime > 50 ? '检查组件复杂度' :
                   selectedMetric.reloadTime > 20 ? '监控性能' : '保持现状'}
                </span>
              </div>
            </div>
          </div>
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
          <Zap className="w-5 h-5 text-yellow-500" />
          热重载调试模式
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMonitoring}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4 inline mr-2" />
                暂停监控
              </>
            ) : (
              <>
                <Play className="w-4 h-4 inline mr-2" />
                开始监控
              </>
            )}
          </button>

          <button
            onClick={clearData}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            重置
          </button>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      {renderStatsCard()}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 实时日志 */}
        <div className="lg:col-span-2">
          {renderLiveLog()}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {renderControlPanel()}
          {renderHeatmap()}
        </div>
      </div>

      {/* 选中指标的详细信息 */}
      <AnimatePresence>
        {selectedMetric && renderMetricDetails()}
      </AnimatePresence>
    </div>
  );
};