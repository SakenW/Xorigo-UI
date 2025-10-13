/**
 * 🎨 搜索结果高亮工具
 *
 * 将搜索匹配位置转换为高亮标记
 */

import React from 'react'
import type { MatchInfo } from '../../app/api/search/types'

/**
 * 高亮匹配文本
 */
export function highlightMatches(
  text: string,
  matches: MatchInfo[] | undefined,
  fieldKey: string
): React.ReactNode {
  if (!matches || matches.length === 0) {
    return text
  }

  // 找到当前字段的匹配信息
  const fieldMatches = matches.filter((m) => m.key === fieldKey)
  if (fieldMatches.length === 0) {
    return text
  }

  // 收集所有匹配位置
  const allIndices: [number, number][] = []
  fieldMatches.forEach((match) => {
    allIndices.push(...match.indices)
  })

  // 按起始位置排序
  allIndices.sort((a, b) => a[0] - b[0])

  // 合并重叠的区间
  const mergedIndices = mergeIntervals(allIndices)

  // 构建高亮片段
  const fragments: React.ReactNode[] = []
  let lastIndex = 0

  mergedIndices.forEach(([start, end], index) => {
    // 添加未匹配部分
    if (start > lastIndex) {
      fragments.push(text.substring(lastIndex, start))
    }

    // 添加匹配部分（高亮）
    fragments.push(
      <mark
        key={`highlight-${index}`}
        className="bg-yellow-200 text-foreground dark:bg-yellow-800/50"
      >
        {text.substring(start, end + 1)}
      </mark>
    )

    lastIndex = end + 1
  })

  // 添加剩余部分
  if (lastIndex < text.length) {
    fragments.push(text.substring(lastIndex))
  }

  return <>{fragments}</>
}

/**
 * 合并重叠的区间
 */
function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return []

  const merged: [number, number][] = []
  let current = intervals[0]

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i]

    // 如果区间重叠或相邻，合并
    if (next[0] <= current[1] + 1) {
      current = [current[0], Math.max(current[1], next[1])]
    } else {
      // 否则添加当前区间，开始新区间
      merged.push(current)
      current = next
    }
  }

  merged.push(current)
  return merged
}

/**
 * 生成搜索摘要（带高亮的文本片段）
 */
export function generateSearchSnippet(
  text: string,
  matches: MatchInfo[] | undefined,
  maxLength: number = 150
): string {
  if (!matches || matches.length === 0) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
  }

  // 找到第一个匹配位置
  const firstMatch = matches[0]
  if (!firstMatch.indices || firstMatch.indices.length === 0) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
  }

  const [matchStart, matchEnd] = firstMatch.indices[0]

  // 计算摘要范围
  const snippetStart = Math.max(0, matchStart - 50)
  const snippetEnd = Math.min(text.length, matchEnd + 100)

  let snippet = text.substring(snippetStart, snippetEnd)

  // 添加省略号
  if (snippetStart > 0) {
    snippet = '...' + snippet
  }
  if (snippetEnd < text.length) {
    snippet = snippet + '...'
  }

  return snippet
}