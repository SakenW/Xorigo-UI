/**
 * 📊 图表组件预览系统
 *
 * 支持的组件：19个图表组件
 * - AreaChart, BarChart, LineChart, PieChart, ColumnChart
 * - DonutChart, FunnelChart, GaugeChart, RadarChart, Heatmap
 * - MiniChart, Sparkline, ChartContainer, ChartTooltip
 * - Legend, Axis, GridLines, SimpleMode, ChartArea
 */

'use client'

import React from 'react'

interface ChartPreviewProps {
  componentName: string
}

export function ChartPreview({ componentName }: ChartPreviewProps) {
  const renderChartPreview = () => {
    switch (componentName) {
      case 'AreaChart':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-16 bg-blue-200 dark:bg-blue-700 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-blue-400 dark:bg-blue-500 rounded-t-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-blue-600 dark:bg-blue-400 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-6 bg-blue-600 dark:bg-blue-400 rounded-tr-lg"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">AreaChart</p>
            </div>
          </div>
        )

      case 'BarChart':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
            <div className="flex items-end justify-center space-x-2 h-20">
              <div className="w-4 h-12 bg-blue-500 rounded-t"></div>
              <div className="w-4 h-16 bg-green-500 rounded-t"></div>
              <div className="w-4 h-8 bg-yellow-500 rounded-t"></div>
              <div className="w-4 h-20 bg-red-500 rounded-t"></div>
              <div className="w-4 h-14 bg-purple-500 rounded-t"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">BarChart</p>
          </div>
        )

      case 'LineChart':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center p-4">
            <svg className="w-24 h-16" viewBox="0 0 100 50">
              <polyline
                points="10,40 30,30 50,35 70,15 90,20"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              <circle cx="10" cy="40" r="2" fill="#10b981" />
              <circle cx="30" cy="30" r="2" fill="#10b981" />
              <circle cx="50" cy="35" r="2" fill="#10b981" />
              <circle cx="70" cy="15" r="2" fill="#10b981" />
              <circle cx="90" cy="20" r="2" fill="#10b981" />
            </svg>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">LineChart</p>
          </div>
        )

      case 'PieChart':
        return (
          <div className="w-full h-32 bg-orange-50 dark:bg-orange-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-transparent"
                     style={{
                       background: 'conic-gradient(from 0deg, #3b82f6 0deg 120deg, #10b981 120deg 200deg, #f59e0b 200deg 280deg, #ef4444 280deg 360deg)'
                     }}></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">PieChart</p>
            </div>
          </div>
        )

      case 'ColumnChart':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg flex items-center justify-center p-4">
            <div className="flex items-end justify-center space-x-3 h-20">
              <div className="w-6 h-14 bg-indigo-500 rounded-t"></div>
              <div className="w-6 h-18 bg-indigo-400 rounded-t"></div>
              <div className="w-6 h-10 bg-indigo-600 rounded-t"></div>
              <div className="w-6 h-16 bg-indigo-300 rounded-t"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">ColumnChart</p>
          </div>
        )

      case 'DonutChart':
        return (
          <div className="w-full h-32 bg-pink-50 dark:bg-pink-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-600"></div>
                <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DonutChart</p>
            </div>
          </div>
        )

      case 'FunnelChart':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="space-y-1">
                <div className="w-16 h-4 bg-purple-500 mx-auto rounded"></div>
                <div className="w-14 h-4 bg-purple-400 mx-auto rounded"></div>
                <div className="w-12 h-4 bg-purple-300 mx-auto rounded"></div>
                <div className="w-10 h-4 bg-purple-200 mx-auto rounded"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">FunnelChart</p>
            </div>
          </div>
        )

      case 'GaugeChart':
        return (
          <div className="w-full h-32 bg-teal-50 dark:bg-teal-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-10 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                     style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 dark:bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">GaugeChart</p>
            </div>
          </div>
        )

      case 'RadarChart':
        return (
          <div className="w-full h-32 bg-cyan-50 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-2 border-cyan-300 dark:border-cyan-600 rotate-45"></div>
                <div className="absolute inset-2 border-2 border-cyan-300 dark:border-cyan-600 rotate-45"></div>
                <div className="absolute inset-4 border-2 border-cyan-300 dark:border-cyan-600 rotate-45"></div>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-600 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-600 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-2 h-2 bg-cyan-600 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-2 h-2 bg-cyan-600 rounded-full transform -translate-y-1/2"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">RadarChart</p>
            </div>
          </div>
        )

      case 'Heatmap':
        return (
          <div className="w-full h-32 bg-red-50 dark:bg-red-900 rounded-lg flex items-center justify-center p-4">
            <div className="grid grid-cols-5 gap-1">
              {[...Array(25)].map((_, i) => {
                const intensity = Math.random()
                const bgColor = intensity > 0.8 ? 'bg-red-600' :
                               intensity > 0.6 ? 'bg-red-500' :
                               intensity > 0.4 ? 'bg-red-400' :
                               intensity > 0.2 ? 'bg-red-300' : 'bg-red-200'
                return <div key={i} className={`w-3 h-3 ${bgColor} rounded-sm`}></div>
              })}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Heatmap</p>
          </div>
        )

      case 'MiniChart':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
            <div className="space-y-2">
              <svg className="w-16 h-8" viewBox="0 0 60 20">
                <polyline
                  points="5,15 15,10 25,12 35,5 45,8 55,3"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="text-xs text-gray-600 dark:text-gray-400">MiniChart</p>
            </div>
          </div>
        )

      case 'Sparkline':
        return (
          <div className="w-full h-32 bg-emerald-50 dark:bg-emerald-900 rounded-lg flex items-center justify-center p-4">
            <div className="space-y-2">
              <svg className="w-20 h-6" viewBox="0 0 80 20">
                <polyline
                  points="5,15 20,5 35,18 50,8 65,12 75,2"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sparkline</p>
            </div>
          </div>
        )

      case 'ChartContainer':
        return (
          <div className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-4">
            <div className="w-24 h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Container</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ChartContainer</p>
          </div>
        )

      case 'ChartTooltip':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <div className="relative">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                Tooltip: 42
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">ChartTooltip</p>
            </div>
          </div>
        )

      case 'Legend':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs">Series A</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Series B</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs">Series C</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Legend</p>
          </div>
        )

      case 'Axis':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
            <div className="relative w-24 h-20">
              <div className="absolute left-0 bottom-0 w-full h-px bg-gray-600 dark:bg-gray-400"></div>
              <div className="absolute left-0 bottom-0 w-px h-full bg-gray-600 dark:bg-gray-400"></div>
              <div className="absolute -left-2 -bottom-2 text-xs text-gray-600 dark:text-gray-400">0</div>
              <div className="absolute -left-4 top-0 text-xs text-gray-600 dark:text-gray-400">100</div>
              <div className="absolute -top-4 left-8 text-xs text-gray-600 dark:text-gray-400">50</div>
              <div className="absolute -right-4 bottom-0 text-xs text-gray-600 dark:text-gray-400">X</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Axis</p>
          </div>
        )

      case 'GridLines':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
            <div className="relative w-24 h-20">
              <div className="absolute inset-0">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`absolute w-full h-px bg-gray-300 dark:bg-gray-600`}
                       style={{ top: `${(i + 1) * 20}%` }}></div>
                ))}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`absolute h-full w-px bg-gray-300 dark:bg-gray-600`}
                       style={{ left: `${(i + 1) * 20}%` }}></div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">GridLines</p>
          </div>
        )

      case 'SimpleMode':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-12 bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center">
                <div className="w-16 h-8 bg-green-400 dark:bg-green-500 rounded"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SimpleMode</p>
            </div>
          </div>
        )

      case 'ChartArea':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-16 relative overflow-hidden rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-indigo-200 dark:bg-indigo-700"></div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-indigo-300 dark:bg-indigo-600"></div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-indigo-400 dark:bg-indigo-500"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ChartArea</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{componentName}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-center">
      {renderChartPreview()}
    </div>
  )
}