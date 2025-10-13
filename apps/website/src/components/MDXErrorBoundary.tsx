/**
 * MDX Error Boundary
 * 用于捕获MDX渲染错误
 */
'use client'

import React from 'react'

interface MDXErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface MDXErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class MDXErrorBoundary extends React.Component<MDXErrorBoundaryProps, MDXErrorBoundaryState> {
  constructor(props: MDXErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): MDXErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MDX Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-800 font-semibold">渲染错误</h3>
        <button
          onClick={reset}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          重试
        </button>
      </div>
      <p className="text-red-700 text-sm mb-2">
        MDX内容渲染时发生了错误
      </p>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2">
          <summary className="text-red-800 text-sm cursor-pointer">
            查看错误详情
          </summary>
          <pre className="mt-2 text-xs text-red-900 bg-red-100 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}