/**
 * @fileoverview LineChart component Storybook stories
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './line-chart';
import type { LineChartProps, DataSeries } from './line-chart';

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
LineChart is a flexible and animated chart component for displaying time-series data
and trend visualization. It supports multiple data series, smooth curves, area fills,
data points, tooltips, and full customization.

## Features

- **Multiple Data Series**: Compare multiple datasets with different colors
- **Smooth Curves**: Optional smooth curve interpolation for better visual flow
- **Step Lines**: Create step line charts for discrete data
- **Area Fills**: Visualize data with filled areas below lines
- **Data Points**: Interactive circles showing individual data points
- **Grid System**: Configurable grid lines for better readability
- **Axes**: Customizable X and Y axes with labels and tick formatting
- **Legend**: Automatic legend showing series names and colors
- **Tooltip**: Hover tooltips with data point information
- **Zoom**: Mouse wheel zoom and pan functionality
- **Animation**: Smooth Framer Motion animations for data transitions
- **Theme Integration**: Full integration with seven-axis theme system
- **Accessibility**: ARIA labels, titles, and descriptions for screen readers

## Usage

\`\`\`tsx
import { LineChart } from '@xorigo-ui/core';

const data = [
  {
    id: 'series-1',
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 4000 },
      { x: 'Feb', y: 3000 },
      { x: 'Mar', y: 5000 }
    ],
    smooth: true,
    area: { enabled: true }
  }
];

<LineChart
  series={data}
  width={800}
  height={400}
  animate={true}
/>
\`\`\`
        `,
      },
    },
    tags: ['autodocs'],
  },
  tags: ['autodocs'],
  argTypes: {
    series: {
      description: 'Array of data series to display',
      control: 'object',
    },
    width: {
      description: 'Chart width in pixels',
      control: { type: 'number' },
      table: { defaultValue: { summary: '800' } },
    },
    height: {
      description: 'Chart height in pixels',
      control: { type: 'number' },
      table: { defaultValue: { summary: '400' } },
    },
    grid: {
      description: 'Grid configuration',
      control: 'object',
    },
    axis: {
      description: 'Axis configuration',
      control: 'object',
    },
    legend: {
      description: 'Legend configuration',
      control: 'object',
    },
    tooltip: {
      description: 'Tooltip configuration',
      control: 'object',
    },
    zoom: {
      description: 'Zoom configuration',
      control: 'object',
    },
    animate: {
      description: 'Enable/disable animations',
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    animationDuration: {
      description: 'Animation duration in milliseconds',
      control: { type: 'number' },
      table: { defaultValue: { summary: '1500' } },
    },
    colors: {
      description: 'Custom color palette',
      control: 'object',
    },
    className: {
      description: 'Additional CSS class name',
      control: 'text',
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta
export { meta };
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const revenueData: DataSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 4000 },
      { x: 'Feb', y: 3000 },
      { x: 'Mar', y: 5000 },
      { x: 'Apr', y: 2780 },
      { x: 'May', y: 1890 },
      { x: 'Jun', y: 2390 },
      { x: 'Jul', y: 3490 },
    ],
    color: 'hsl(var(--chart-1))',
    smooth: true,
    area: { enabled: true, fillOpacity: 0.3 },
    points: { enabled: true, radius: 4, hoverRadius: 6 },
  },
];

const comparisonData: DataSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 4000 },
      { x: 'Feb', y: 3000 },
      { x: 'Mar', y: 5000 },
      { x: 'Apr', y: 2780 },
      { x: 'May', y: 1890 },
      { x: 'Jun', y: 2390 },
      { x: 'Jul', y: 3490 },
    ],
    color: 'hsl(var(--chart-1))',
    smooth: true,
    area: { enabled: true, fillOpacity: 0.3 },
    points: { enabled: true, radius: 4, hoverRadius: 6 },
  },
  {
    id: 'expenses',
    name: 'Expenses',
    data: [
      { x: 'Jan', y: 2400 },
      { x: 'Feb', y: 1398 },
      { x: 'Mar', y: 9800 },
      { x: 'Apr', y: 3908 },
      { x: 'May', y: 4800 },
      { x: 'Jun', y: 3800 },
      { x: 'Jul', y: 4300 },
    ],
    color: 'hsl(var(--chart-2))',
    smooth: true,
    area: { enabled: true, fillOpacity: 0.3 },
    points: { enabled: true, radius: 4, hoverRadius: 6 },
  },
];

const multiSeriesData: DataSeries[] = [
  {
    id: 'desktop',
    name: 'Desktop',
    data: [
      { x: 'Week 1', y: 186 },
      { x: 'Week 2', y: 305 },
      { x: 'Week 3', y: 237 },
      { x: 'Week 4', y: 273 },
      { x: 'Week 5', y: 351 },
      { x: 'Week 6', y: 414 },
      { x: 'Week 7', y: 358 },
    ],
    color: 'hsl(var(--chart-1))',
    smooth: true,
  },
  {
    id: 'mobile',
    name: 'Mobile',
    data: [
      { x: 'Week 1', y: 80 },
      { x: 'Week 2', y: 149 },
      { x: 'Week 3', y: 127 },
      { x: 'Week 4', y: 141 },
      { x: 'Week 5', y: 155 },
      { x: 'Week 6', y: 179 },
      { x: 'Week 7', y: 163 },
    ],
    color: 'hsl(var(--chart-2))',
    smooth: true,
  },
  {
    id: 'tablet',
    name: 'Tablet',
    data: [
      { x: 'Week 1', y: 23 },
      { x: 'Week 2', y: 42 },
      { x: 'Week 3', y: 35 },
      { x: 'Week 4', y: 47 },
      { x: 'Week 5', y: 53 },
      { x: 'Week 6', y: 61 },
      { x: 'Week 7', y: 58 },
    ],
    color: 'hsl(var(--chart-3))',
    smooth: true,
  },
];

const stepChartData: DataSeries[] = [
  {
    id: 'discrete',
    name: 'Discrete Data',
    data: [
      { x: 1, y: 10 },
      { x: 2, y: 30 },
      { x: 3, y: 15 },
      { x: 4, y: 45 },
      { x: 5, y: 25 },
      { x: 6, y: 55 },
    ],
    color: 'hsl(var(--chart-1))',
    step: true,
    points: { enabled: true, radius: 5 },
  },
];

const negativeData: DataSeries[] = [
  {
    id: 'profit-loss',
    name: 'Profit/Loss',
    data: [
      { x: 'Q1', y: -5000 },
      { x: 'Q2', y: 3000 },
      { x: 'Q3', y: -2000 },
      { x: 'Q4', y: 8000 },
    ],
    color: 'hsl(var(--chart-2))',
    smooth: true,
    area: { enabled: true },
  },
];

const largeDataset: DataSeries[] = [
  {
    id: 'big-data',
    name: 'Large Dataset',
    data: Array.from({ length: 100 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 10) * 100 + Math.random() * 20,
    })),
    color: 'hsl(var(--chart-1))',
    smooth: true,
    points: { enabled: false },
  },
];

const realTimeData: DataSeries[] = [
  {
    id: 'live-data',
    name: 'Live Data Stream',
    data: Array.from({ length: 50 }, (_, i) => ({
      x: i,
      y: Math.random() * 100,
    })),
    color: 'hsl(var(--chart-1))',
    smooth: true,
    points: { enabled: true, radius: 2 },
  },
];

// ============================================================================
// Stories
// ============================================================================

export const Basic: Story = {
  args: {
    series: revenueData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic line chart with a single data series, smooth curves, and area fill.',
      },
    },
  },
};

export const Comparison: Story = {
  args: {
    series: comparisonData,
    width: 800,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compare two data series (Revenue vs Expenses) with different colors and area fills.',
      },
    },
  },
};

export const MultiSeries: Story = {
  args: {
    series: multiSeriesData,
    width: 900,
    height: 450,
    legend: { enabled: true, position: 'top' },
    grid: { enabled: true, opacity: 0.2 },
    axis: {
      x: { enabled: true, label: 'Time Period' },
      y: { enabled: true, label: 'Count', tickFormat: (value: number) => `${value}` },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Display multiple data series with automatic legend and formatted axis labels.',
      },
    },
  },
};

export const StepChart: Story = {
  args: {
    series: stepChartData,
    width: 700,
    height: 400,
    grid: { enabled: true },
    axis: {
      x: { enabled: true, label: 'Period' },
      y: { enabled: true, label: 'Value' },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step line chart for discrete data that changes at specific intervals.',
      },
    },
  },
};

export const NegativeValues: Story = {
  args: {
    series: negativeData,
    width: 700,
    height: 400,
    grid: { enabled: true },
    axis: {
      x: { enabled: true, label: 'Quarter' },
      y: { enabled: true, label: 'Amount', tickFormat: (value: number) => `$${value}` },
    },
    tooltip: {
      enabled: true,
      showValue: true,
      showSeries: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Handle negative and positive values with area fills crossing the zero baseline.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    series: largeDataset,
    width: 900,
    height: 400,
    animate: true,
    animationDuration: 2000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Render large datasets with 100+ data points efficiently.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '900px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoAnimation: Story = {
  args: {
    series: comparisonData,
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable animations for better performance with large datasets or for users who prefer reduced motion.',
      },
    },
  },
};

export const WithZoom: Story = {
  args: {
    series: realTimeData,
    width: 800,
    height: 400,
    zoom: {
      enabled: true,
      minZoom: 0.5,
      maxZoom: 5,
    },
    grid: { enabled: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Enable mouse wheel zoom and pan functionality. Scroll to zoom in/out.',
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    series: comparisonData,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use custom color palette to match your brand or design system.',
      },
    },
  },
};

export const NoLegend: Story = {
  args: {
    series: revenueData,
    legend: { enabled: false },
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hide the legend when you have a single data series or want a cleaner look.',
      },
    },
  },
};

export const NoGrid: Story = {
  args: {
    series: revenueData,
    grid: { enabled: false },
    axis: {
      x: { enabled: true },
      y: { enabled: true },
    },
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Remove grid lines for a minimalist chart appearance.',
      },
    },
  },
};

export const NoPoints: Story = {
  args: {
    series: revenueData,
    series: revenueData.map((s) => ({
      ...s,
      points: { enabled: false },
    })),
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hide data points for a cleaner line-only visualization.',
      },
    },
  },
};

export const CustomMargins: Story = {
  args: {
    series: comparisonData,
    margin: {
      top: 40,
      right: 120,
      bottom: 60,
      left: 70,
    },
    axis: {
      x: { enabled: true, label: 'Month' },
      y: { enabled: true, label: 'Value ($)' },
    },
    legend: {
      enabled: true,
      position: 'right',
    },
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize margins and legend position for optimal layout.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    series: comparisonData,
    tooltip: {
      enabled: true,
      followCursor: false,
      showValue: true,
      showSeries: true,
    },
    width: 800,
    height: 400,
  },
  play: async ({ canvasElement }) => {
    // Simulate user interaction for testing
    const canvas = canvasElement as HTMLElement;
    const svg = canvas.querySelector('svg');
    if (svg) {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
      });
      svg.dispatchEvent(event);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive chart with tooltips. Hover over data points to see detailed information.',
      },
    },
  },
};

export const Responsive: Story = {
  args: {
    series: comparisonData,
    width: 600,
    height: 300,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Chart that adapts to container width. The component respects the width prop.',
      },
    },
  },
};

// ============================================================================
// Edge Cases
// ============================================================================

export const EmptyData: Story = {
  args: {
    series: [],
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Handle empty data gracefully without errors.',
      },
    },
  },
};

export const SinglePoint: Story = {
  args: {
    series: [
      {
        id: 'single',
        name: 'Single Point',
        data: [{ x: 0, y: 100 }],
        color: 'hsl(var(--chart-1))',
        points: { enabled: true, radius: 6 },
      },
    ],
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Render a chart with only one data point.',
      },
    },
  },
};

export const ZeroBaseline: Story = {
  args: {
    series: [
      {
        id: 'non-negative',
        name: 'Non-negative Data',
        data: [
          { x: 'Jan', y: 0 },
          { x: 'Feb', y: 10 },
          { x: 'Mar', y: 20 },
          { x: 'Apr', y: 5 },
        ],
        color: 'hsl(var(--chart-1))',
        area: { enabled: true },
      },
    ],
    width: 700,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Handle data that starts at or crosses the zero baseline.',
      },
    },
  },
};

// ============================================================================
// Performance Stories
// ============================================================================

export const LargeDatasetOptimized: Story = {
  args: {
    series: [
      {
        id: 'optimized',
        name: 'Optimized Large Dataset',
        data: Array.from({ length: 1000 }, (_, i) => ({
          x: i,
          y: Math.sin(i / 20) * 100,
        })),
        color: 'hsl(var(--chart-1))',
        smooth: true,
        points: { enabled: false },
      },
    ],
    width: 1000,
    height: 400,
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Optimized chart for 1000+ data points. Animations disabled, points hidden for better performance.',
      },
    },
  },
};
