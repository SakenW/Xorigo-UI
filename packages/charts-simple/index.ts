/**
 * @fileoverview Simple Charts - Easy-to-use chart components with configuration-style API
 * @version 1.0.0
 * @author Xorigo UI Team
 */

export { default as SimpleLineChart } from './simple-line-chart'
export type { SimpleLineChartProps } from './simple-line-chart'

export { default as SimpleBarChart } from './simple-bar-chart'
export type { SimpleBarChartProps } from './simple-bar-chart'

export { default as SimplePieChart } from './simple-pie-chart'
export type { SimplePieChartProps } from './simple-pie-chart'

/**
 * @example
 *
 * Usage examples:
 *
 * // Simple Line Chart
 * <SimpleLineChart
 *   data={[['Jan', 4000], ['Feb', 3000], ['Mar', 5000]]}
 *   title="Monthly Revenue"
 *   xAxis="Month"
 *   yAxis="Revenue"
 *   theme="business"
 *   smooth={true}
 *   showArea={true}
 * />
 *
 * // Simple Bar Chart
 * <SimpleBarChart
 *   data={[['Product A', 4000], ['Product B', 3000]]}
 *   title="Product Sales"
 *   xAxis="Products"
 *   yAxis="Sales"
 *   theme="dashboard"
 *   showValues={true}
 * />
 *
 * // Simple Pie Chart
 * <SimplePieChart
 *   data={[
 *     { name: 'Desktop', value: 4000 },
 *     { name: 'Mobile', value: 3000 },
 *     { name: 'Tablet', value: 2000 }
 *   ]}
 *   title="Device Usage"
 *   theme="donut"
 *   donut={true}
 * />
 */
