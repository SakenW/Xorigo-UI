/**
 * 调试工具测试组件
 * 用于验证调试工具的各项功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@xorigo-ui/core';
import {
  globalProfiler,
  globalDependencyAnalyzer,
  globalErrorDetector,
  globalHotReloadMonitor
} from '../core/debug-engine';
import { DebugErrorBoundary } from '../error/error-boundary-detector';

export const DebugToolsTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // 测试性能分析器
  const testPerformanceProfiler = () => {
    addTestResult('开始测试性能分析器...');

    // 测试性能测量
    globalProfiler.startMeasure('test-component');

    setTimeout(() => {
      globalProfiler.endMeasure('test-component', 'TestComponent');

      const metrics = globalProfiler.getMetrics();
      const report = globalProfiler.getPerformanceReport();

      addTestResult(`性能分析器测试完成 - 测量次数: ${metrics.length}, 平均渲染时间: ${report.averageRenderTime.toFixed(2)}ms`);
    }, 100);
  };

  // 测试依赖分析器
  const testDependencyAnalyzer = () => {
    addTestResult('开始测试依赖分析器...');

    const mockComponents = [
      { name: 'TestComponent1', type: 'component', dependencies: ['TestComponent2'] },
      { name: 'TestComponent2', type: 'component', dependencies: [] },
      { name: 'TestComponent3', type: 'component', dependencies: ['TestComponent1'] }
    ];

    const graph = globalDependencyAnalyzer.analyzeDependencies(mockComponents);
    const cycles = globalDependencyAnalyzer.detectCircularDependencies();

    addTestResult(`依赖分析器测试完成 - 节点数: ${graph.nodes.length}, 边数: ${graph.edges.length}, 循环依赖: ${cycles.length}`);
  };

  // 测试错误检测器
  const testErrorDetector = () => {
    addTestResult('开始测试错误检测器...');

    try {
      // 故意抛出一个错误来测试
      throw new Error('这是一个测试错误');
    } catch (error) {
      const errorReport = globalErrorDetector.captureError(error as Error, {
        componentName: 'TestComponent',
        stack: 'Test stack trace'
      });

      const report = globalErrorDetector.getErrorReport();

      addTestResult(`错误检测器测试完成 - 错误总数: ${report.total}, 错误类型: ${errorReport.type}`);
    }
  };

  // 测试热重载监控
  const testHotReloadMonitor = () => {
    addTestResult('开始测试热重载监控...');

    globalHotReloadMonitor.recordReload('TestComponent', 25.5, 'component-update');
    globalHotReloadMonitor.recordReload('TestComponent2', 15.2, 'style-change');

    const report = globalHotReloadMonitor.getHotReloadReport();

    addTestResult(`热重载监控测试完成 - 总重载次数: ${report.totalReloads}, 平均重载时间: ${report.averageReloadTime.toFixed(2)}ms`);
  };

  // 测试错误边界
  const [shouldError, setShouldError] = useState(false);
  const testErrorBoundary = () => {
    addTestResult('开始测试错误边界...');
    setShouldError(true);
  };

  if (shouldError) {
    throw new Error('测试错误边界 - 这是一个故意的错误');
  }

  // 清除测试结果
  const clearResults = () => {
    setTestResults([]);
    globalProfiler.destroy();
    globalErrorDetector.clearErrors();
    globalHotReloadMonitor.clearMetrics();
  };

  return (
    <DebugErrorBoundary componentName="DebugToolsTest">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          调试工具功能测试
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            onClick={testPerformanceProfiler}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            测试性能分析器
          </Button>

          <Button
            onClick={testDependencyAnalyzer}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            测试依赖分析器
          </Button>

          <Button
            onClick={testErrorDetector}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            测试错误检测器
          </Button>

          <Button
            onClick={testHotReloadMonitor}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            测试热重载监控
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={testErrorBoundary}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            测试错误边界
          </Button>

          <Button
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            清除结果
          </Button>
        </div>

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              测试结果
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 系统状态 */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            系统状态
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">性能指标</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {globalProfiler.getMetrics().length} 条记录
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">错误记录</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {globalErrorDetector.getErrors().length} 个错误
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">热重载记录</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {globalHotReloadMonitor.getHotReloadReport().totalReloads} 次重载
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">依赖图节点</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {globalDependencyAnalyzer.getGraph().nodes.length} 个节点
              </div>
            </div>
          </div>
        </div>
      </div>
    </DebugErrorBoundary>
  );
};