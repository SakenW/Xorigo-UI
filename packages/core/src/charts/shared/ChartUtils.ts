import type { ChartData, ChartSeries } from './ChartTypes'

export const generateColors = (count: number, theme: 'light' | 'dark' = 'light'): string[] => {
  const lightColors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
  ]

  const darkColors = [
    '#60a5fa', // blue-400
    '#34d399', // emerald-400
    '#fbbf24', // amber-400
    '#f87171', // red-400
    '#a78bfa', // violet-400
    '#f472b6', // pink-400
    '#2dd4bf', // teal-400
    '#fb923c', // orange-400
    '#22d3ee', // cyan-400
    '#bef264', // lime-400
  ]

  const colors = theme === 'dark' ? darkColors : lightColors

  if (count <= colors.length) {
    return colors.slice(0, count)
  }

  // 如果需要更多颜色，循环使用并调整透明度
  const result = [...colors]
  for (let i = colors.length; i < count; i++) {
    const baseColor = colors[i % colors.length]
    const opacity = 0.7 - (Math.floor(i / colors.length) * 0.1)
    result.push(`${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`)
  }
  return result
}

export const getMaxValue = (data: ChartSeries[]): number => {
  let max = 0
  data.forEach(series => {
    series.data.forEach(point => {
      if (point.value > max) {
        max = point.value
      }
    })
  })
  return max
}

export const getMinValue = (data: ChartSeries[]): number => {
  let min = Infinity
  data.forEach(series => {
    series.data.forEach(point => {
      if (point.value < min) {
        min = point.value
      }
    })
  })
  return min === Infinity ? 0 : min
}

export const getTotalValue = (data: ChartData[]): number => {
  return data.reduce((sum, item) => sum + item.value, 0)
}

export const formatValue = (value: number, format?: 'number' | 'currency' | 'percentage'): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
      }).format(value)
    case 'percentage':
      return new Intl.NumberFormat('zh-CN', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value)
    default:
      return new Intl.NumberFormat('zh-CN').format(value)
  }
}

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return value / total
}

export const createResponsiveDimensions = (
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number = 16 / 9
) => {
  const width = containerWidth
  const height = containerHeight || width / aspectRatio

  return {
    width,
    height,
    margin: {
      top: Math.max(20, height * 0.05),
      right: Math.max(20, width * 0.05),
      bottom: Math.max(40, height * 0.1),
      left: Math.max(40, width * 0.1)
    }
  }
}

export const interpolatePath = (points: Array<{ x: number; y: number }>, smooth: boolean = false): string => {
  if (points.length < 2) return ''

  if (!smooth) {
    return points.map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')
  }

  // 平滑曲线
  const firstPoint = points[0]
  let path = `M ${firstPoint.x} ${firstPoint.y}`

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i]
    const nextPoint = points[i + 1]
    const xMid = (currentPoint.x + nextPoint.x) / 2
    const yMid = (currentPoint.y + nextPoint.y) / 2
    const cp1x = (xMid + currentPoint.x) / 2
    const cp2x = (xMid + nextPoint.x) / 2

    path += ` Q ${cp1x} ${currentPoint.y}, ${xMid} ${yMid}`
    path += ` Q ${cp2x} ${nextPoint.y}, ${nextPoint.x} ${nextPoint.y}`
  }

  return path
}

export const getSteppedPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length < 2) return ''

  const firstPoint = points[0]
  let path = `M ${firstPoint.x} ${firstPoint.y}`

  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i]
    path += ` H ${currentPoint.x}`
    path += ` V ${currentPoint.y}`
  }

  return path
}