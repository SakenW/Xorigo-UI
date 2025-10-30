/**
 * 错误边界检测器
 * 提供自动错误边界包装、错误分类统计、错误追踪等功能
 */

'use client';

import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Bug,
  Shield,
  TrendingUp,
  Clock,
  FileText,
  RefreshCw,
  Trash2,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { globalErrorDetector } from '../core/debug-engine';
import { ErrorReport, ErrorReportSummary } from '../types/debug';

// 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
  componentName?: string;
}

export class DebugErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 记录错误到全局错误检测器
    const errorReport = globalErrorDetector.captureError(
      error,
      errorInfo,
      {
        componentName: this.props.componentName,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    );

    this.props.onError?.(error, errorInfo);

    // 发送错误报告（可选）
    this.sendErrorReport(errorReport);
  }

  private sendErrorReport = (errorReport: ErrorReport) => {
    // 这里可以集成错误报告服务，如 Sentry
    console.log('Error Report:', errorReport);
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 m-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              组件发生错误
            </h3>
          </div>

          <div className="text-sm text-red-700 dark:text-red-300 mb-4">
            {this.props.componentName && (
              <p className="font-medium mb-2">
                组件: {this.props.componentName}
              </p>
            )}
            <p className="mb-2">
              {this.state.error?.message || '未知错误'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              重试
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              刷新页面
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
            <details className="mt-4">
              <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer">
                查看错误详情
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// 错误边界检测器主组件
interface ErrorBoundaryDetectorProps {
  className?: string;
}

export const ErrorBoundaryDetector: React.FC<ErrorBoundaryDetectorProps> = ({
  className = ''
}) => {
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [errorSummary, setErrorSummary] = useState<ErrorReportSummary | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorReport | null>(null);
  const [filter, setFilter] = useState<{
    type: string;
    severity: string;
    timeRange: string;
  }>({
    type: 'all',
    severity: 'all',
    timeRange: 'all'
  });

  // 刷新错误数据
  const refreshErrors = useCallback(() => {
    const newErrors = globalErrorDetector.getErrors();
    const newSummary = globalErrorDetector.getErrorReport();
    setErrors(newErrors);
    setErrorSummary(newSummary);
  }, []);

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      refreshErrors();
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshErrors]);

  // 初始加载
  useEffect(() => {
    refreshErrors();
  }, [refreshErrors]);

  // 清除错误
  const clearErrors = () => {
    globalErrorDetector.clearErrors();
    refreshErrors();
    setSelectedError(null);
  };

  // 获取严重程度图标
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bug className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取严重程度颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // 过滤错误
  const filteredErrors = useMemo(() => {
    return errors.filter(error => {
      if (filter.type !== 'all' && error.type !== filter.type) return false;
      if (filter.severity !== 'all' && error.severity !== filter.severity) return false;

      if (filter.timeRange !== 'all') {
        const now = Date.now();
        const timeDiff = now - error.timestamp;

        switch (filter.timeRange) {
          case '1h':
            if (timeDiff > 60 * 60 * 1000) return false;
            break;
          case '24h':
            if (timeDiff > 24 * 60 * 60 * 1000) return false;
            break;
          case '7d':
            if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
            break;
        }
      }

      return true;
    });
  }, [errors, filter]);

  // 渲染统计卡片
  const renderStatsCard = () => {
    if (!errorSummary) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          错误统计
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {errorSummary.total}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">总错误数</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {errorSummary.bySeverity.critical + errorSummary.bySeverity.high}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">严重错误</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {errorSummary.frequent.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">重复错误</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Object.keys(errorSummary.byType).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">错误类型</div>
          </div>
        </div>

        {/* 错误类型分布 */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">错误类型分布</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(errorSummary.byType).map(([type, count]) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染错误列表
  const renderErrorList = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            错误列表 ({filteredErrors.length})
          </h4>
          <button
            onClick={clearErrors}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 inline mr-1" />
            清除
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredErrors.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>暂无错误记录</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredErrors.map((error, index) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedError?.id === error.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedError(error)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityIcon(error.severity)}
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        {error.type}
                      </span>
                      {error.count > 1 && (
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                          {error.count}次
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {error.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(error.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {error.context?.componentName && (
                        <p>{error.context.componentName}</p>
                      )}
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

  // 渲染错误详情
  const renderErrorDetails = () => {
    if (!selectedError) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            错误详情
          </h3>
          <button
            onClick={() => setSelectedError(null)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">错误类型</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {selectedError.type}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">严重程度</div>
              <div className={`font-medium inline-flex items-center gap-1 ${getSeverityColor(selectedError.severity)}`}>
                {getSeverityIcon(selectedError.severity)}
                {selectedError.severity}
              </div>
            </div>
          </div>

          {/* 错误消息 */}
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">错误消息</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-gray-100">
              {selectedError.message}
            </div>
          </div>

          {/* 时间戳 */}
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">发生时间</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {new Date(selectedError.timestamp).toLocaleString()}
            </div>
          </div>

          {/* 上下文信息 */}
          {selectedError.context && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">上下文信息</div>
              <div className="space-y-1">
                {Object.entries(selectedError.context).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 错误堆栈 */}
          {selectedError.stack && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">错误堆栈</div>
              <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-64">
                {selectedError.stack}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染频繁错误
  const renderFrequentErrors = () => {
    if (!errorSummary?.frequent.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
      >
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" />
          频繁错误
        </h4>
        <div className="space-y-2">
          {errorSummary.frequent.map((error, index) => (
            <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
              <span className="font-medium truncate">{error.message}</span>
              <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                {error.count} 次
              </span>
            </div>
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
          <Bug className="w-5 h-5 text-red-500" />
          错误边界检测
        </h2>

        <div className="flex items-center gap-2">
          {/* 过滤器 */}
          <div className="flex items-center gap-2">
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="all">所有类型</option>
              <option value="TypeError">TypeError</option>
              <option value="ReferenceError">ReferenceError</option>
              <option value="SyntaxError">SyntaxError</option>
              <option value="NetworkError">NetworkError</option>
              <option value="RenderError">RenderError</option>
            </select>

            <select
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="all">所有级别</option>
              <option value="critical">严重</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>

            <select
              value={filter.timeRange}
              onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="all">所有时间</option>
              <option value="1h">最近1小时</option>
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
            </select>
          </div>

          <button
            onClick={refreshErrors}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            刷新
          </button>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      {renderStatsCard()}

      {/* 频繁错误警告 */}
      {renderFrequentErrors()}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 错误列表 */}
        <div className="lg:col-span-2">
          {renderErrorList()}
        </div>

        {/* 错误详情 */}
        <div>
          {renderErrorDetails()}
        </div>
      </div>
    </div>
  );
};

// HOC: 为组件添加错误边界
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    componentName?: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
) => {
  const WrappedComponent = (props: P) => (
    <DebugErrorBoundary
      componentName={options?.componentName || Component.displayName || Component.name}
      fallback={options?.fallback}
      onError={options?.onError}
    >
      <Component {...props} />
    </DebugErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};