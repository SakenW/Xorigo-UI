/**
 * @fileoverview FunnelChart component - A flexible, animated funnel chart visualization
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

export interface FunnelChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with data)
   * Format: [{ name, value }, { name, value }]
   * @example
   * [
   *   { name: '访问', value: 10000 },
   *   { name: '注册', value: 5000 },
   *   { name: '付费', value: 1000 }
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
   * Funnel chart direction
   * @default 'top-to-bottom'
   */
  direction?: 'top-to-bottom' | 'bottom-to-top'

  /**
   * Whether to show percentage
   * @default true
   */
  showPercentage?: boolean

  /**
   * Whether to show value
   * @default true
   */
  showValue?: boolean

  /**
   * Whether to show label
   * @default true
   */
  showLabel?: boolean

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
  onStageClick?: (data: { name: string, value: number, percentage: number, index: number }) => void;

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

// ============================================================================
// FunnelChart Component
// ============================================================================

const FunnelChart = forwardRef<SVGSVGElement, FunnelChartProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      data,
      size = 400,
      direction = 'top-to-bottom',
      showPercentage = true,
      showValue = true,
      showLabel = true,
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onStageClick,
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
      throw new Error('FunnelChart: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both');
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
        direction,
        showPercentage,
        showValue,
        showLabel,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
        onStageClick
      };
    }, [
      mode,
      simpleData,
      theme,
      preset,
      size,
      direction,
      showPercentage,
      showValue,
      showLabel,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children,
      onStageClick
    ]);

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('funnel-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedFunnelChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedFunnelChart
        ref={ref}
        data={data!}
        size={size}
        direction={direction}
        showPercentage={showPercentage}
        showValue={showValue}
        showLabel={showLabel}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        colors={colors}
        className={className}
        children={children}
        onStageClick={onStageClick}
      />
    );
  }
);

// Advanced FunutChart component (core implementation)
const AdvancedFunnelChart = forwardRef<SVGSVGElement, Omit<FunnelChartProps, 'simpleData' | 'title' | 'theme'>>(
  (
    {
      data,
      size = 400,
      direction = 'top-to-bottom',
      showPercentage = true,
      showValue = true,
      showLabel = true,
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onStageClick,
    },
    ref
  ) => {
    const width = size;
    const height = size;

    // Calculate total and percentages
    const total = useMemo(() => {
      return data.reduce((sum, item) => sum + item.y, 0);
    }, [data]);

    // Process data with percentages
    const processedData = useMemo(() => {
      return data.map((item, index) => {
        const percentage = (item.y / total) * 100;
        const width = (item.y / total) * 100;

        return {
          ...item,
          percentage,
          width,
          color: item.metadata?.color || colors[index % colors.length]
        };
      });
    }, [data, total, colors]);

    const handleStageClick = (item: any, index: number) => {
      onStageClick?.({
        name: String(item.x),
        value: item.y,
        percentage: item.percentage,
        index
      });
    };

    // Calculate funnel dimensions
    const stageHeight = height / data.length;
    const maxWidth = width * 0.8;

    return (
      <div className={cn('relative inline-block', className)}>
        <svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label="Funnel chart visualization"
        >
          <title>Funnel Chart</title>
          <desc>
            Funnel chart displaying {data.length} stages with total value of {total}
          </desc>

          <g transform={`translate(${(width - maxWidth) / 2}, 0)`}>
            <AnimatePresence>
              {processedData.map((item, index) => {
                const currentWidth = (maxWidth * item.width) / 100;
                const nextItem = processedData[index + 1];
                const nextWidth = nextItem ? (maxWidth * nextItem.width) / 100 : currentWidth * 0.7;
                const y = index * stageHeight;

                // Calculate trapezoid points
                const topLeft = direction === 'top-to-bottom'
                  ? { x: (maxWidth - currentWidth) / 2, y }
                  : { x: (maxWidth - currentWidth) / 2, y: height - y - stageHeight };
                const topRight = direction === 'top-to-bottom'
                  ? { x: (maxWidth + currentWidth) / 2, y }
                  : { x: (maxWidth + currentWidth) / 2, y: height - y - stageHeight };
                const bottomRight = direction === 'top-to-bottom'
                  ? { x: (maxWidth + nextWidth) / 2, y: y + stageHeight }
                  : { x: (maxWidth + nextWidth) / 2, y: height - y };
                const bottomLeft = direction === 'top-to-bottom'
                  ? { x: (maxWidth - nextWidth) / 2, y: y + stageHeight }
                  : { x: (maxWidth - nextWidth) / 2, y: height - y };

                const pathData = `
                  M ${topLeft.x} ${topLeft.y}
                  L ${topRight.x} ${topRight.y}
                  L ${bottomRight.x} ${bottomRight.y}
                  L ${bottomLeft.x} ${bottomLeft.y}
                  Z
                `;

                return (
                  <motion.path
                    key={`stage-${index}`}
                    d={pathData}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={animate ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: (animationDuration / 1000),
                      delay: index * 0.1
                    }}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleStageClick(item, index)}
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

FunnelChart.displayName = 'FunnelChart'
AdvancedFunnelChart.displayName = 'AdvancedFunnelChart'

// ============================================================================
// Default Props
// ============================================================================

FunnelChart.defaultProps = {
  size: 400,
  theme: 'business',
  direction: 'top-to-bottom',
  showPercentage: true,
  showValue: true,
  showLabel: true,
  animate: true
}

AdvancedFunnelChart.defaultProps = {
  size: 400,
  direction: 'top-to-bottom',
  showPercentage: true,
  showValue: true,
  showLabel: true,
  legend: { enabled: true, position: 'bottom', align: 'center' },
  tooltip: { enabled: true, showValue: true, showPercentage: true },
  animate: true,
  animationDuration: 1000,
}

// ============================================================================
// Export
// ============================================================================

export default FunnelChart
export { FunnelChart, AdvancedFunnelChart }

export type {
  FunnelChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
