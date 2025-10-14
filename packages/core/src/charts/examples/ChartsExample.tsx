import React from 'react'
import { LineChart, BarChart, PieChart } from '@xorigo-ui/core'

// 示例数据
const lineChartData = [
  {
    name: '1月',
    data: [
      { name: '1月', value: 400, color: '#3b82f6' },
      { name: '1月', value: 240, color: '#10b981' },
      { name: '1月', value: 340, color: '#f59e0b' }
    ]
  },
  {
    name: '2月',
    data: [
      { name: '2月', value: 300, color: '#3b82f6' },
      { name: '2月', value: 139, color: '#10b981' },
      { name: '2月', value: 221, color: '#f59e0b' }
    ]
  },
  {
    name: '3月',
    data: [
      { name: '3月', value: 200, color: '#3b82f6' },
      { name: '3月', value: 980, color: '#10b981' },
      { name: '3月', value: 429, color: '#f59e0b' }
    ]
  },
  {
    name: '4月',
    data: [
      { name: '4月', value: 278, color: '#3b82f6' },
      { name: '4月', value: 390, color: '#10b981' },
      { name: '4月', value: 300, color: '#f59e0b' }
    ]
  },
  {
    name: '5月',
    data: [
      { name: '5月', value: 189, color: '#3b82f6' },
      { name: '5月', value: 480, color: '#10b981' },
      { name: '5月', value: 218, color: '#f59e0b' }
    ]
  },
  {
    name: '6月',
    data: [
      { name: '6月', value: 239, color: '#3b82f6' },
      { name: '6月', value: 380, color: '#10b981' },
      { name: '6月', value: 450, color: '#f59e0b' }
    ]
  }
]

const barChartData = [
  {
    name: '产品A',
    data: [
      { name: 'Q1', value: 4000 },
      { name: 'Q2', value: 3000 },
      { name: 'Q3', value: 2000 },
      { name: 'Q4', value: 2780 }
    ]
  },
  {
    name: '产品B',
    data: [
      { name: 'Q1', value: 2400 },
      { name: 'Q2', value: 1398 },
      { name: 'Q3', value: 9800 },
      { name: 'Q4', value: 3908 }
    ]
  }
]

const pieChartData = [
  { name: '直接访问', value: 335, color: '#3b82f6' },
  { name: '邮件营销', value: 310, color: '#10b981' },
  { name: '联盟广告', value: 234, color: '#f59e0b' },
  { name: '视频广告', value: 135, color: '#ef4444' },
  { name: '搜索引擎', value: 1548, color: '#8b5cf6' }
]

export default function ChartsExample() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Xorigo UI 图表组件示例
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            展示 LineChart、BarChart、PieChart 组件的基本用法
          </p>
        </div>

        {/* LineChart 示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            折线图 - 多系列数据展示
          </h2>
          <div className="h-96">
            <LineChart
              series={lineChartData}
              variant="smooth"
              size="lg"
              showGrid={true}
              showDots={true}
              showTooltip={true}
              showLegend={true}
              strokeWidth={3}
              animationDuration={2}
            />
          </div>
        </div>

        {/* BarChart 示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            柱状图 - 分组模式
          </h2>
          <div className="h-96">
            <BarChart
              series={barChartData}
              variant="grouped"
              size="lg"
              showGrid={true}
              showTooltip={true}
              showLegend={true}
              showValues={true}
              animationDuration={1.5}
            />
          </div>
        </div>

        {/* PieChart 示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            饼图 - 甜甜圈模式
          </h2>
          <div className="h-96">
            <PieChart
              data={pieChartData}
              variant="donut"
              size="lg"
              showTooltip={true}
              showLegend={true}
              showLabels={true}
              showPercentage={true}
              labelPosition="outside"
              animationDuration={1.8}
            />
          </div>
        </div>

        {/* 组合展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              阶梯折线图
            </h2>
            <div className="h-64">
              <LineChart
                series={[lineChartData[0]]}
                variant="stepped"
                size="md"
                showGrid={true}
                showDots={true}
                showLegend={false}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              堆叠柱状图
            </h2>
            <div className="h-64">
              <BarChart
                series={barChartData}
                variant="stacked"
                size="md"
                showGrid={true}
                showLegend={false}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              半圆饼图
            </h2>
            <div className="h-64">
              <PieChart
                data={pieChartData.slice(0, 4)}
                variant="semi-circle"
                size="md"
                showLegend={false}
                endAngle={180}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              标准饼图
            </h2>
            <div className="h-64">
              <PieChart
                data={pieChartData.slice(0, 4)}
                variant="default"
                size="md"
                showLegend={false}
                labelPosition="inside"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}