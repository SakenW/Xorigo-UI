'use client'

import React, { useState, useRef } from 'react'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'success' | 'error' | 'pending'
  progress?: number
  error?: string
}

interface UploadRendererProps {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onChange?: (files: FileItem[]) => void
  updateProp?: (prop: string, value: any) => void
}

export default function UploadRenderer({
  accept = '*/*',
  multiple = false,
  disabled = false,
  onChange,
  updateProp
}: UploadRendererProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊'
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️'
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return '📦'
    if (type.includes('text/')) return '📄'
    return '📎'
  }

  const simulateUpload = (file: File): Promise<FileItem> => {
    return new Promise((resolve) => {
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }

      // 模拟上传进度
      const interval = setInterval(() => {
        fileItem.progress = (fileItem.progress || 0) + Math.random() * 30
        if (fileItem.progress! >= 100) {
          fileItem.progress = 100
          fileItem.status = 'success'
          clearInterval(interval)
          resolve(fileItem)
        }
        setFiles(prev => prev.map(f => f.id === fileItem.id ? fileItem : f))
      }, 200)

      setFiles(prev => [...prev, fileItem])
    })
  }

  const handleFileSelect = async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles)

    if (!multiple) {
      setFiles([])
    }

    const newFiles: FileItem[] = []

    for (const file of fileArray) {
      if (accept === '*/*' || file.type.match(accept.replace('*', '.*'))) {
        const fileItem = await simulateUpload(file)
        newFiles.push(fileItem)
      } else {
        const errorItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          error: '文件类型不支持'
        }
        newFiles.push(errorItem)
      }
    }

    const allFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(allFiles)

    if (onChange) {
      onChange(allFiles)
    }
    if (updateProp) {
      updateProp('files', allFiles)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId)
    setFiles(newFiles)
    if (onChange) {
      onChange(newFiles)
    }
    if (updateProp) {
      updateProp('files', newFiles)
    }
  }

  const handleRetryUpload = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      const updatedFile: FileItem = {
        ...file,
        status: 'uploading',
        progress: 0,
        error: undefined
      }
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f))

      // 模拟重新上传
      setTimeout(() => {
        const successFile: FileItem = {
          ...updatedFile,
          status: 'success',
          progress: 100
        }
        setFiles(prev => prev.map(f => f.id === fileId ? successFile : f))
      }, 2000)
    }
  }

  return (
    <div className="w-full">
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="text-4xl">
            {isDragOver ? '📥' : '📤'}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isDragOver ? '释放文件以上传' : '点击或拖拽文件到此处上传'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accept !== '*/*' ? `支持格式: ${accept}` : '支持所有文件类型'}
              {multiple ? ' (可多选)' : ' (单选)'}
            </p>
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            文件列表 ({files.length})
          </h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-2xl">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.type || '未知类型'}</span>
                  </div>

                  {/* 上传进度条 */}
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        上传中... {Math.round(file.progress || 0)}%
                      </p>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      {file.error}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* 状态图标 */}
                <div className="text-lg">
                  {file.status === 'success' && '✅'}
                  {file.status === 'error' && '❌'}
                  {file.status === 'uploading' && '⏳'}
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-1">
                  {file.status === 'error' && (
                    <button
                      onClick={() => handleRetryUpload(file.id)}
                      className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                      title="重试上传"
                    >
                      🔄
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    title="删除文件"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 状态信息 */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        上传状态: {files.filter(f => f.status === 'success').length} 成功,
        {files.filter(f => f.status === 'uploading').length} 上传中,
        {files.filter(f => f.status === 'error').length} 失败 |
        多选: {multiple ? '启用' : '禁用'} |
        接受格式: {accept}
      </div>
    </div>
  )
}