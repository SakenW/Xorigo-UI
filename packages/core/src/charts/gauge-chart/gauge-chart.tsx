/**
 * @fileoverview GaugeChart component - A flexible, animated gauge chart visualization
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
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
  SimpleTheme,
  SIMPLE_PRESETS,
} from '../simple-mode/utils';

// ============================================================================
// Types
// ============================================================================

export interface GaugeDataPoint {
  value: number;
  label?: string;
  color?: string;
  threshold?: number;
}

export interface GaugeThresholds {
  warning: number;
  danger: number;
}

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

export interface GaugeChartProps {
  /**
   * === Simple Mode ===
   * Simplified gauge value (mutually exclusive with data)
   * Format: number
   */
  value?: number;

  /**
   * Simple mode: Chart title
   */
  title?: string;

  /**
   * Simple mode: Preset theme
   * @default 'business'
   */
  theme?: SimpleTheme;

  /**
   * === Advanced Mode ===
   * Data series for the gauge (mutually exclusive with value)
   */
  data?: DataPoint[];

  /**
   * Chart size in pixels
   * @default 400
   */
  size?: number;

  /**
   * Gauge minimum value
   * @default 0
   */
  min?: number;

  /**
   * Gauge maximum value
   * @default 100
   */
  max?: number;

  /**
   * Gauge label
   */
  label?: string;

  /**
   * Unit to display
   * @default '%'
   */
  unit?: string;

  /**
   * Number of decimal places
   * @default 0
   */
  decimals?: number;

  /**
   * Threshold configuration
   */
  thresholds?: GaugeThresholds;

  /**
   * Whether to show pointer
   * @default true
   */
  showPointer?: boolean;

  /**
   * Whether to show thresholds
   * @default true
   */
  showThresholds?: boolean;

  /**
   * Legend configuration
   */
  legend?: LegendConfig;

  /**
   * Tooltip configuration
   */
  tooltip?: TooltipConfig;

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
 * 将数值映射到角度
 */
function mapValueToAngle(
  value: number,
  min: number,
  max: number,
  startAngle: number,
  endAngle: number
): number {
  const normalized = (value - min) / (max - min);
  return startAngle + normalized * (endAngle - startAngle);
}

/**
 * 极坐标转笛卡尔坐标
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

/**
 * 生成仪表盘弧路径
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

/**
 * 获取阈值颜色
 */
function getThresholdColor(
  value: number,
  thresholds: GaugeThresholds | undefined,
  defaultColor: string
): string {
  if (!thresholds) return defaultColor;

  if (value >= thresholds.danger) return 'hsl(var(--chart-3))';
  if (value >= thresholds.warning) return 'hsl(var(--chart-2))';
  return defaultColor;
}

// ============================================================================
// GaugeChart Component
// ============================================================================

const GaugeChart = forwardRef<SVGSVGElement, GaugeChartProps>(
  (
    {
      value,
      title,
      theme = 'business',
      data,
      size = 400,
      min = 0,
      max = 100,
      label,
      unit = '%',
      decimals = 0,
      thresholds,
      showPointer = true,
      showThresholds = true,
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
    },
    ref
  ) => {
    // Auto-detect mode
    const mode = useMemo(() => {
      if (value !== undefined && !data) {
        return 'simple';
      }
      if (data && value === undefined) {
        return 'advanced';
      }
      throw new Error('GaugeChart: Must provide either "value" (simple mode) or "data" (advanced mode), but not both');
    }, [value, data]);

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

      // For simple mode, use the single value
      const gaugeValue = value || 0;

      return {
        data: [{ x: 'value', y: gaugeValue, label: label || 'Value' }],
        size,
        min,
        max,
        label,
        unit,
        decimals,
        thresholds,
        showPointer,
        showThresholds,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
      };
    }, [
      mode,
      value,
      theme,
      preset,
      size,
      min,
      max,
      label,
      unit,
      decimals,
      thresholds,
      showPointer,
      showThresholds,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children
    ]);

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('gauge-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedGaugeChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedGaugeChart
        ref={ref}
        data={data!}
        size={size}
        min={min}
        max={max}
        label={label}
        unit={unit}
        decimals={decimals}
        thresholds={thresholds}
        showPointer={showPointer}
        showThresholds={showThresholds}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        colors={colors}
        className={className}
        children={children}
      />
    );
  }
);

// Advanced GaugeChart component (core implementation)
const AdvancedGaugeChart = forwardRef<SVGSVGElement, Omit<GaugeChartProps, 'value' | 'title' | 'theme'>>(
  (
    {
      data,
      size = 400,
      min = 0,
      max = 100,
      label,
      unit = '%',
      decimals = 0,
      thresholds,
      showPointer = true,
      showThresholds = true,
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
    },
    ref
  ) => {
    const width = size;
    const height = size;
    const radius = width / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    // Get the first data point for the gauge value
    const gaugeValue = data[0]?.y || 0;
    const displayLabel = data[0]?.label || label || 'Value';

    // Calculate angles
    const startAngle = 180;
    const endAngle = 0;
    const currentAngle = useMemo(() => {
      return mapValueToAngle(gaugeValue, min, max, startAngle, endAngle);
    }, [gaugeValue, min, max]);

    const progressAngle = useMemo(() => {
      return mapValueToAngle(Math.min(gaugeValue, max), min, max, startAngle, endAngle);
    }, [gaugeValue, min, max, startAngle, endAngle]);

    // Generate arc paths
    const backgroundPath = useMemo(() => {
      return describeArc(centerX, centerY, radius, startAngle, endAngle);
    }, [centerX, centerY, radius, startAngle, endAngle]);

    const progressPath = useMemo(() => {
      if (progressAngle <= startAngle) return '';
      return describeArc(centerX, centerY, radius, startAngle, progressAngle);
    }, [centerX, centerY, radius, startAngle, progressAngle]);

    // Calculate pointer position
    const pointerPosition = useMemo(() => {
      return polarToCartesian(centerX, centerY, radius - 10, currentAngle);
    }, [centerX, centerY, radius, currentAngle]);

    // Get progress color
    const progressColor = useMemo(() => {
      return getThresholdColor(gaugeValue, thresholds, colors[0]);
    }, [gaugeValue, thresholds, colors]);

    // Calculate threshold points
    const thresholdPoints = useMemo(() => {
      if (!thresholds || !showThresholds) return [];

      return [
        {
          name: 'warning',
          value: thresholds.warning,
          angle: mapValueToAngle(thresholds.warning, min, max, startAngle, endAngle),
        },
        {
          name: 'danger',
          value: thresholds.danger,
          angle: mapValueToAngle(thresholds.danger, min, max, startAngle, endAngle),
        },
      ];
    }, [thresholds, showThresholds, min, max, startAngle, endAngle]);

    // Animation config
    const animationConfig = {
      initial: { rotate: startAngle },
      animate: { rotate: currentAngle },
      transition: animate ? { duration: animationDuration / 1000, ease: 'easeInOut' } : { duration: 0 },
    };

    // Format value display
    const formatValue = (val: number): string => {
      return val.toFixed(decimals);
    };

    return (
      <div className={cn('relative inline-block', className)}>
        <svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label="Gauge chart visualization"
        >
          <title>Gauge Chart</title>
          <desc>
            Gauge chart displaying value: {formatValue(gaugeValue)}{unit}, range: {min} - {max}{unit}
          </desc>

          {/* Background arc */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-20"
          />

          {/* Progress arc */}
          {progressPath && (
            <motion.path
              d={progressPath}
              fill="none"
              stroke={progressColor}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={animate ? { duration: animationDuration / 1000, ease: 'easeInOut' } : { duration: 0 }}
            />
          )}

          {/* Threshold lines */}
          {thresholdPoints.map((point) => {
            const position = polarToCartesian(centerX, centerY, radius, point.angle);
            return (
              <g key={point.name}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={position.x}
                  y2={position.y}
                  stroke={point.name === 'danger' ? colors[2] : colors[1]}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-60"
                />
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="4"
                  fill={point.name === 'danger' ? colors[2] : colors[1]}
                  className="opacity-80"
                />
              </g>
            );
          })}

          {/* Pointer */}
          {showPointer && (
            <motion.g
              transform-origin={`${centerX} ${centerY}`}
              {...animationConfig}
            >
              <line
                x1={centerX}
                y1={centerY}
                x2={pointerPosition.x}
                y2={pointerPosition.y}
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="8"
                fill="white"
                className="drop-shadow-sm"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="4"
                fill={progressColor}
              />
            </motion.g>
          )}

          {/* Value display */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className="text-2xl font-semibold fill-foreground"
            fontSize="24"
          >
            {formatValue(gaugeValue)}
          </text>

          {/* Unit */}
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="text-sm fill-muted-foreground"
          >
            {unit}
          </text>

          {/* Label */}
          {displayLabel && (
            <text
              x={centerX}
              y={centerY + 35}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {displayLabel}
            </text>
          )}

          {/* Min value label */}
          {showThresholds && (
            <text
              x={polarToCartesian(centerX, centerY, radius + 15, startAngle).x}
              y={polarToCartesian(centerX, centerY, radius + 15, startAngle).y}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {min}
            </text>
          )}

          {/* Max value label */}
          {showThresholds && (
            <text
              x={polarToCartesian(centerX, centerY, radius + 15, endAngle).x}
              y={polarToCartesian(centerX, centerY, radius + 15, endAngle).y}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {max}
            </text>
          )}

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
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: progressColor }}
              />
              <span className="text-sm text-foreground">
                {displayLabel} ({formatValue(gaugeValue)}{unit})
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

GaugeChart.displayName = 'GaugeChart'
AdvancedGaugeChart.displayName = 'AdvancedGaugeChart'

// ============================================================================
// Default Props
// ============================================================================

GaugeChart.defaultProps = {
  size: 400,
  theme: 'business',
  min: 0,
  max: 100,
  unit: '%',
  decimals: 0,
  showPointer: true,
  showThresholds: true,
  animate: true
}

AdvancedGaugeChart.defaultProps = {
  size: 400,
  min: 0,
  max: 100,
  unit: '%',
  decimals: 0,
  showPointer: true,
  showThresholds: true,
  legend: { enabled: true, position: 'bottom', align: 'center' },
  tooltip: { enabled: true, showValue: true },
  animate: true,
  animationDuration: 1000,
}

// ============================================================================
// Export
// ============================================================================

export default GaugeChart
export { GaugeChart, AdvancedGaugeChart }

export type {
  GaugeChartProps,
  GaugeDataPoint,
  GaugeThresholds,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
