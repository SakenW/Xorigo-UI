'use client'

import React, { useEffect, useState } from 'react'

export default function TestImport() {
  const [importStatus, setImportStatus] = useState('加载中...')
  const [themeCount, setThemeCount] = useState(0)

  useEffect(() => {
    const testImport = async () => {
      try {
        // 尝试导入 @xorigo-ui/tokens 模块
        const tokensModule = await import('@xorigo-ui/tokens')
        console.log('成功导入 @xorigo-ui/tokens:', Object.keys(tokensModule))

        // 检查导出的内容
        const { themeRecipes, recipeCategories, themeUtils } = tokensModule

        if (themeRecipes) {
          const count = Object.keys(themeRecipes).length
          setThemeCount(count)
          setImportStatus(`✅ 成功导入！找到 ${count} 个主题`)
          console.log('主题列表:', Object.keys(themeRecipes))
        } else {
          setImportStatus('❌ 未找到 themeRecipes')
        }

      } catch (error) {
        console.error('导入失败:', error)
        setImportStatus(`❌ 导入失败: ${error.message}`)
      }
    }

    testImport()
  }, [])

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      <h3 className="font-bold mb-2">📦 模块导入测试</h3>
      <p className="text-sm">{importStatus}</p>
      {themeCount > 0 && (
        <p className="text-xs mt-1">主题数量: {themeCount}</p>
      )}
    </div>
  )
}