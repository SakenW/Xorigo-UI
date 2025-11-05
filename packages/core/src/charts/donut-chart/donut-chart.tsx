/**
 * @fileoverview DonutChart component - A flexible, animated donut chart visualization
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
  SimpleTheme,
  transformSimplePieData,
  SIMPLE_PRESETS,
  isSimpleMode,
  isAdvancedMode,
  validateSimpleModeProps,
  validateAdvancedModeProps,
} from '../simple-mode/utils';

// ============================================================================
// Types
// ============================================================================

export interface DataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface DataSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  bar?: {
    enabled: boolean;
    width?: number;
    radius?: number;
  };
  points?: {
    enabled: boolean;
    radius?: number;
    hoverRadius?: number;
  };
  smooth?: boolean;
  step?: boolean;
}

export interface GridConfig {
  enabled: boolean;
  x?: {
    enabled: boolean;
    tickCount?: number;
  };
  y?: {
    enabled: boolean;
    tickCount?: number;
  };
  color?: string;
  opacity?: number;
}

export interface AxisConfig {
  x: {
    enabled: boolean;
    tickCount?: number;
    tickFormat?: (value: any) => string;
    label?: string;
    labelOffset?: number;
  };
  y: {
    enabled: boolean;
    tickCount?: number;
    tickFormat?: (value: number) => string;
    label?: string;
    labelOffset?: number;
  };
}

export interface LegendConfig {
  enabled: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export interface TooltipConfig {
  enabled: boolean;
  followCursor?: boolean;
  showValue?: boolean;
  showSeries?: boolean;
  offset?: number;
}

export interface DonutChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with data)
   * Format: [{ name, value }, { name, value }]
   * @example
   * [
   *   { name: 'Desktop', value: 4000 },
   *   { name: 'Mobile', value: 3000 },
   *   { name: 'Tablet', value: 2000 }
   * ]
   */
  simpleData?: Array<{ name: string, value: number }>

  /**
   * Simple mode: Chart title
   */
  title?: string

  /**
   * Simple mode: Preset theme
   * @default 'business'
   */
  theme?: SimpleTheme

  /**
   * === Advanced Mode ===
   * Data source (mutually exclusive with simpleData)
   */
  data?: DataPoint[]

  /**
   * Chart size in pixels
   * @default 400
   */
  size?: number

  /**
   * Inner radius for donut chart (0-1 ratio)
   * @default 0.6
   */
  innerRadius?: number

  /**
   * Legend configuration
   */
  legend?: LegendConfig

  /**
   * Tooltip configuration
   */
  tooltip?: TooltipConfig

  /**
   * Animation configuration
   */
  animate?: boolean;
  animationDuration?: number;

  /**
   * Color palette override
   */
  colors?: string[];

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Children content (custom overlays)
   */
  children?: React.ReactNode;

  /**
   * Event handlers
   */
  onSliceClick?: (data: { name: string, value: number, percentage: number, index: number }) => void;

  // Inherited from forwardRef
  ref?: React.Ref<SVGSVGElement>;
}

// Export SimpleDataPoint from utils
export type SimpleDataPoint = {
  x: string | number;
  y: number;
};

// ============================================================================
// Constants & Utils
// ============================================================================

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Calculate arc path
const calculateArcPath = (
  cx: number,
  cy: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = (startAngle - 90) * (Math.PI / 180);
  const end = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);

  const isDonut = innerRadius > 0;

  if (isDonut) {
    const x3 = cx + innerRadius * Math.cos(end);
    const y3 = cy + innerRadius * Math.sin(end);
    const x4 = cx + innerRadius * Math.cos(start);
    const y4 = cy + innerRadius * Math.sin(start);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      'M', x1, y1,
      'A', radius, radius, 0, largeArc, 1, x2, y2,
      'L', x3, y3,
      'A', innerRadius, innerRadius, 0, largeArc, 0, x4, y4,
      'Z'
    ].join(' ');
  }

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    'M', cx, cy,
    'L', x1, y1,
    'A', radius, radius, 0, largeArc, 1, x2, y2,
    'Z'
  ].join(' ');
};

// ============================================================================
// DonutChart Component
// ============================================================================

const DonutChart = forwardRef<SVGSVGElement, DonutChartProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      data,
      size = 400,
      innerRadius = 0.6,
      legend = { enabled: true, position: 'right', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onSliceClick,
    },
    ref
  ) => {
    // Auto-detect mode
    const mode = useMemo(() => {
      if (simpleData && !data) {
        return 'simple';
      }
      if (data && !simpleData) {
        return 'advanced';
      }
      throw new Error('DonutChart: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both');
    }, [simpleData, data]);

    // Get preset configuration for simple mode
    const preset = useMemo(() => {
      if (mode === 'simple') {
        return SIMPLE_PRESETS[theme];
      }
      return null;
    }, [mode, theme]);

    // Transform simple mode props to advanced mode format
    const advancedModeProps = useMemo(() => {
      if (mode !== 'simple') return null;

      // Transform data to DataPoint format
      const transformedData = transformSimplePieData(simpleData!).map((item, index) => ({
        x: item.name,
        y: item.value,
        label: item.name
      }));

      return {
        data: transformedData,
        size,
        innerRadius,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
        onSliceClick
      };
    }, [
      mode,
      simpleData,
      theme,
      preset,
      size,
      innerRadius,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children,
      onSliceClick
    ]);

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('donut-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedDonutChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedDonutChart
        ref={ref}
        data={data!}
        size={size}
        innerRadius={innerRadius}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        colors={colors}
        className={className}
        children={children}
        onSliceClick={onSliceClick}
      />
    );
  }
);

// Advanced DonutChart component (core implementation)
const AdvancedDonutChart = forwardRef<SVGSVGElement, Omit<DonutChartProps, 'simpleData' | 'title' | 'theme'>>(
  (
    {
      data,
      size = 400,
      innerRadius = 0.6,
      legend = { enabled: true, position: 'right', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onSliceClick,
    },
    ref
  ) => {
    const radius = size / 2;
    const finalInnerRadius = radius * innerRadius;

    // Calculate total and percentages
    const total = useMemo(() => {
      return data.reduce((sum, item) => sum + item.y, 0);
    }, [data]);

    // Calculate angles
    const processedData = useMemo(() => {
      let currentAngle = 0;
      return data.map((item, index) => {
        const angle = (item.y / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle += angle;

        const percentage = (item.y / total) * 100;

        return {
          ...item,
          percentage,
          startAngle,
          endAngle,
          color: item.metadata?.color || colors[index % colors.length]
        };
      });
    }, [data, total, colors]);

    const handleSliceClick = (item: any, index: number) => {
      onSliceClick?.({
        name: String(item.x),
        value: item.y,
        percentage: item.percentage,
        index
      });
    };

    return (
      <div className={cn('relative inline-block', className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="overflow-visible"
          role="img"
          aria-label="Donut chart visualization"
        >
          <title>Donut Chart</title>
          <desc>
            Donut chart displaying {data.length} categories with total value of {total}
          </desc>

          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <AnimatePresence>
              {processedData.map((item, index) => {
                const path = calculateArcPath(
                  0,
                  0,
                  radius,
                  finalInnerRadius,
                  item.startAngle,
                  item.endAngle
                );

                return (
                  <motion.path
                    key={`slice-${index}`}
                    d={path}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={animate ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: (animationDuration / 1000),
                      delay: index * 0.1
                    }}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleSliceClick(item, index)}
                  />
                );
              })}
            </AnimatePresence>
          </g>

          {/* Custom children overlay */}
          {children && (
            <g className="overlay">{children}</g>
          )}
        </svg>

        {/* Legend */}
        {legend.enabled && (
          <div
            className={cn(
              'flex gap-4 mt-4',
              legend.position === 'top' && 'justify-center',
              legend.position === 'left' && 'justify-start',
              legend.position === 'right' && 'justify-end',
              legend.position === 'bottom' && 'justify-center'
            )}
          >
            {processedData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">
                  {item.x} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart'
AdvancedDonutChart.displayName = 'AdvancedDonutChart'

// ============================================================================
// Default Props
// ============================================================================

DonutChart.defaultProps = {
  size: 400,
  theme: 'business',
  innerRadius: 0.6,
  animate: true
}

AdvancedDonutChart.defaultProps = {
  size: 400,
  innerRadius: 0.6,
  legend: { enabled: true, position: 'right', align: 'center' },
  tooltip: { enabled: true, showValue: true, showPercentage: true },
  animate: true,
  animationDuration: 1000,
}

// ============================================================================
// Export
// ============================================================================

export default DonutChart
export { DonutChart, AdvancedDonutChart }

export type {
  DonutChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
