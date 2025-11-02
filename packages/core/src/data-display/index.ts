/**
 * Data Display Components - 数据展示组件集合
 *
 * 提供数据展示、图表、表格等可视化组件
 * 用于展示复杂的数据关系和信息
 */

// 临时导出空对象，避免依赖问题
// TODO: 修复组件依赖问题后重新导出

export const DataDisplayComponents = {
  // 基础数据展示组件
  Table: null,
  List: null,
  Accordion: null,
  Carousel: null,

  // 图表组件
  Chart: null,
  BarChart: null,
  LineChart: null,
  PieChart: null,
  Gauge: null,
  Stat: null
} as any

// 类型导出
export interface TableProps {}
export interface ListProps {}
export interface AccordionProps {}
export interface CarouselProps {}
export interface ChartProps {}
export interface BarChartProps {}
export interface LineChartProps {}
export interface PieChartProps {}
export interface GaugeProps {}
export interface StatProps {}