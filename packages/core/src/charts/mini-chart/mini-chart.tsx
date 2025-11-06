/**
 * @fileoverview MiniChart component - A flexible, compact mini chart visualization
 * @version 1.0.0
 * @author Xorigo UI Team
 */

'use client'

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

export interface MiniChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with data)
   * Format: [{ name, value }, { name, value }]
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
   * Chart type
   * @default 'line'
   */
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut'

  /**
   * Chart width
   * @default 120
   */
  width?: number

  /**
   * Chart height
   * @default 60
   */
  height?: number

  /**
   * Compact mode
   * @default false
   */
  compact?: boolean

  /**
   * Show trend indicator
   * @default false
   */
  showTrend?: boolean

  /**
   * Show percentage change
   * @default false
   */
  showChange?: boolean

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
  onDataPointClick?: (data: DataPoint) => void;
  onDataPointHover?: (data: DataPoint | null) => void;

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

/**
 * 计算趋势
 */
const calculateTrend = (
  data: DataPoint[],
  mode: 'auto' | 'up' | 'down' | 'neutral' = 'auto'
): { direction: 'up' | 'down' | 'neutral', percentage: number } => {
  if (data.length < 2) {
    return { direction: 'neutral', percentage: 0 };
  }

  if (mode !== 'auto') {
    const percentage = Math.abs(
      ((data[data.length - 1].y - data[0].y) / data[0].y) * 100
    );
    return { direction: mode, percentage };
  }

  const first = data[0].y;
  const last = data[data.length - 1].y;
  const percentage = ((last - first) / (first || 1)) * 100;

  if (percentage > 1) {
    return { direction: 'up', percentage };
  } else if (percentage < -1) {
    return { direction: 'down', percentage: Math.abs(percentage) };
  } else {
    return { direction: 'neutral', percentage: 0 };
  }
};

/**
 * 计算线图路径
 */
const calculateLinePath = (
  points: DataPoint[],
  width: number,
  height: number,
  variant: 'line' | 'area'
): string => {
  if (points.length === 0) return '';

  const maxValue = Math.max(...points.map(p => p.y));
  const minValue = Math.min(...points.map(p => p.y));
  const range = maxValue - minValue || 1;

  const stepX = width / (points.length - 1 || 1);

  const smoothPoints = points.map((point, index) => ({
    x: index * stepX,
    y: height - ((point.y - minValue) / range) * height,
  }));

  // 构建路径
  let path = `M ${smoothPoints[0].x},${smoothPoints[0].y}`;

  for (let i = 1; i < smoothPoints.length; i++) {
    path += ` L ${smoothPoints[i].x},${smoothPoints[i].y}`;
  }

  if (variant === 'area') {
    path += ` L ${smoothPoints[smoothPoints.length - 1].x},${height}`;
    path += ` L 0,${height} Z`;
  }

  return path;
};

/**
 * 计算柱状图路径
 */
const calculateBarPath = (
  points: DataPoint[],
  width: number,
  height: number
): Array<{ x: number; y: number; w: number; h: number; color: string }> => {
  if (points.length === 0) return [];

  const maxValue = Math.max(...points.map(p => p.y));
  const minValue = Math.min(...points.map(p => p.y));
  const range = maxValue - minValue || 1;

  const barWidth = width / points.length * 0.7;
  const barSpacing = width / points.length * 0.3;

  return points.map((point, index) => {
    const barHeight = ((point.y - minValue) / range) * height;
    const x = index * (barWidth + barSpacing) + barSpacing / 2;
    const y = height - barHeight;

    return {
      x,
      y,
      w: barWidth,
      h: barHeight,
      color: point.metadata?.color || 'currentColor',
    };
  });
};

/**
 * 计算饼图路径
 */
const calculatePiePath = (
  points: DataPoint[],
  width: number,
  height: number,
  innerRadiusRatio: number = 0
): Array<{ path: string; color: string }> => {
  if (points.length === 0) return [];

  const total = points.reduce((sum, p) => sum + p.y, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 2;
  const innerRadius = radius * innerRadiusRatio;

  let currentAngle = -Math.PI / 2; // 从顶部开始

  return points.map((point) => {
    const angle = (point.y / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    let path = '';

    if (innerRadius > 0) {
      // 环形图
      const ix1 = centerX + innerRadius * Math.cos(endAngle);
      const iy1 = centerY + innerRadius * Math.sin(endAngle);
      const ix2 = centerX + innerRadius * Math.cos(startAngle);
      const iy2 = centerY + innerRadius * Math.sin(startAngle);

      path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2} Z`;
    } else {
      // 饼图
      path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }

    currentAngle += angle;

    return {
      path,
      color: point.metadata?.color || 'currentColor',
    };
  });
};

// ============================================================================
// MiniChart Component
// ============================================================================

const MiniChart = forwardRef<SVGSVGElement, MiniChartProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      data,
      type = 'line',
      width = 120,
      height = 60,
      compact = false,
      showTrend = false,
      showChange = false,
      legend = { enabled: false },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onDataPointClick,
      onDataPointHover,
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
      throw new Error('MiniChart: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both');
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
        type,
        width,
        height,
        compact,
        showTrend,
        showChange,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
        onDataPointClick,
        onDataPointHover
      };
    }, [
      mode,
      simpleData,
      theme,
      preset,
      type,
      width,
      height,
      compact,
      showTrend,
      showChange,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children,
      onDataPointClick,
      onDataPointHover
    ]);

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('mini-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedMiniChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedMiniChart
        ref={ref}
        data={data!}
        type={type}
        width={width}
        height={height}
        compact={compact}
        showTrend={showTrend}
        showChange={showChange}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        colors={colors}
        className={className}
        children={children}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
      />
    );
  }
);

// Advanced MiniChart component (core implementation)
const AdvancedMiniChart = forwardRef<SVGSVGElement, Omit<MiniChartProps, 'simpleData' | 'title' | 'theme'>>(
  (
    {
      data,
      type = 'line',
      width = 120,
      height = 60,
      compact = false,
      showTrend = false,
      showChange = false,
      legend = { enabled: false },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onDataPointClick,
      onDataPointHover,
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate trend
    const trend = useMemo(() => {
      return calculateTrend(data, 'auto');
    }, [data]);

    // Calculate render data based on chart type
    const renderData = useMemo(() => {
      const padding = compact ? 2 : 4;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      switch (type) {
        case 'line':
        case 'area':
          return {
            path: calculateLinePath(data, chartWidth, chartHeight, type),
            points: data.map((point, index) => {
              const maxValue = Math.max(...data.map(p => p.y));
              const minValue = Math.min(...data.map(p => p.y));
              const range = maxValue - minValue || 1;
              const stepX = chartWidth / (data.length - 1 || 1);

              return {
                x: padding + index * stepX,
                y: padding + (chartHeight - ((point.y - minValue) / range) * chartHeight),
                ...point,
              };
            }),
          };

        case 'bar':
          return {
            bars: calculateBarPath(data, chartWidth, chartHeight),
          };

        case 'pie':
        case 'donut':
          return {
            segments: calculatePiePath(data, width, height, type === 'donut' ? 0.6 : 0),
          };

        default:
          return null;
      }
    }, [data, width, height, type, compact]);

    // Mouse event handlers
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
      if (!containerRef.current || data.length === 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;

      // Find nearest point
      const stepX = width / data.length;
      const index = Math.round(x / stepX);
      const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

      setHoveredIndex(clampedIndex);

      if (onDataPointHover) {
        onDataPointHover(data[clampedIndex]);
      }
    };

    const handleMouseLeave = () => {
      setHoveredIndex(null);
      if (onDataPointHover) {
        onDataPointHover(null);
      }
    };

    const handleClick = (index: number) => {
      if (onDataPointClick) {
        onDataPointClick(data[index]);
      }
    };

    // Animation variants
    const chartVariants = {
      initial: { opacity: 0, scale: 0.9 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: animationDuration / 1000,
          ease: 'easeOut',
        },
      },
    };

    const itemVariants = {
      initial: { opacity: 0, scale: 0 },
      animate: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
          delay: (animationDuration / 1000) * 0.1 * index,
          duration: 0.3,
          ease: 'easeOut',
        },
      }),
    };

    // Trend color helper
    const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
      switch (direction) {
        case 'up':
          return 'text-green-500';
        case 'down':
          return 'text-red-500';
        default:
          return 'text-gray-500';
      }
    };

    const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
      switch (direction) {
        case 'up':
          return '↑';
        case 'down':
          return '↓';
        default:
          return '→';
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn('relative inline-block', className)}
        style={{ width, height }}
      >
        <motion.svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          variants={animate ? chartVariants : undefined}
          initial={animate ? 'initial' : undefined}
          animate={animate ? 'animate' : undefined}
        >
          {/* Render different chart types */}
          {type === 'line' || type === 'area' ? (
            <>
              {/* Path */}
              <motion.path
                d={renderData?.path || ''}
                fill={type === 'area' ? 'hsl(var(--chart-1))' : 'none'}
                className={cn(
                  type === 'area' ? 'opacity-20' : '',
                  'stroke-[hsl(var(--chart-1))]'
                )}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={animate ? itemVariants : undefined}
                custom={0}
              />

              {/* Data points */}
              {renderData?.points?.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredIndex === index ? 4 : 3}
                  fill="white"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  className="cursor-pointer"
                  onClick={() => handleClick(index)}
                  variants={animate ? itemVariants : undefined}
                  custom={index + 1}
                />
              ))}
            </>
          ) : type === 'bar' ? (
            /* Bar chart */
            <g>
              {renderData?.bars?.map((bar, index) => (
                <motion.rect
                  key={index}
                  x={bar.x}
                  y={bar.y}
                  width={bar.w}
                  height={bar.h}
                  fill={bar.color}
                  rx={compact ? 1 : 2}
                  className="cursor-pointer"
                  onClick={() => handleClick(index)}
                  variants={animate ? itemVariants : undefined}
                  custom={index}
                />
              ))}
            </g>
          ) : type === 'pie' || type === 'donut' ? (
            /* Pie/Donut chart */
            <g>
              {renderData?.segments?.map((segment, index) => (
                <motion.path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  className={cn(
                    'cursor-pointer',
                    hoveredIndex === index ? 'opacity-80' : 'opacity-90'
                  )}
                  onClick={() => handleClick(index)}
                  variants={animate ? itemVariants : undefined}
                  custom={index}
                />
              ))}
            </g>
          ) : null}

          {/* Custom children overlay */}
          {children && (
            <g className="overlay">{children}</g>
          )}
        </motion.svg>

        {/* Trend indicator */}
        {showTrend && (
          <div className={cn('absolute -right-1 -top-1 text-xs font-medium', getTrendColor(trend.direction))}>
            <span>
              {getTrendIcon(trend.direction)}
              {trend.percentage.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Percentage change */}
        {showChange && (
          <div className={cn('absolute -right-1 -bottom-1 text-xs font-medium', getTrendColor(trend.direction))}>
            <span>
              {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              {Math.abs(trend.percentage).toFixed(1)}%
            </span>
          </div>
        )}

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
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.metadata?.color || colors[index % colors.length] }}
                />
                <span className="text-xs text-foreground">
                  {item.x}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

MiniChart.displayName = 'MiniChart'
AdvancedMiniChart.displayName = 'AdvancedMiniChart'

// ============================================================================
// Default Props
// ============================================================================

MiniChart.defaultProps = {
  type: 'line',
  width: 120,
  height: 60,
  theme: 'business',
  compact: false,
  showTrend: false,
  showChange: false,
  animate: true
}

AdvancedMiniChart.defaultProps = {
  type: 'line',
  width: 120,
  height: 60,
  compact: false,
  showTrend: false,
  showChange: false,
  legend: { enabled: false },
  tooltip: { enabled: true, showValue: true },
  animate: true,
  animationDuration: 1000,
}

// ============================================================================
// Export
// ============================================================================

export default MiniChart
export { MiniChart, AdvancedMiniChart }

export type {
  MiniChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
