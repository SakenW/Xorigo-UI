/**
 * @fileoverview RadarChart component - A flexible, animated radar chart visualization
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
  transformSimpleLineData,
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
  area?: {
    enabled: boolean;
    fillOpacity?: number;
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

export interface RadarChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with series)
   * Format: [[x, y], [x, y]] or [{ x, y }, { x, y }]
   */
  simpleData?: Array<[string | number, number]> | Array<SimpleDataPoint>

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
   * Data series for the radar chart (mutually exclusive with simpleData)
   */
  series?: DataSeries[]

  /**
   * Chart dimensions
   */
  width?: number;
  height?: number;

  /**
   * Grid configuration
   */
  grid?: GridConfig;

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

  /**
   * Event handlers
   */
  onDataPointClick?: (data: DataPoint & { seriesId: string }) => void;
  onDataPointHover?: (data: DataPoint & { seriesId: string } | null) => void;

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
// RadarChart Component
// ============================================================================

const RadarChart = forwardRef<SVGSVGElement, RadarChartProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      series,
      width = 400,
      height = 400,
      grid = { enabled: true },
      legend = { enabled: true, position: 'top', align: 'center' },
      tooltip = { enabled: true, followCursor: false },
      animate = true,
      animationDuration = 1500,
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
      if (simpleData && !series) {
        validateSimpleModeProps({ simpleData, series });
        return 'simple';
      }
      if (series && !simpleData) {
        validateAdvancedModeProps({ simpleData, series });
        return 'advanced';
      }
      throw new Error('RadarChart: Must provide either "simpleData" (simple mode) or "series" (advanced mode), but not both');
    }, [simpleData, series]);

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

      // Transform data to series format
      const transformedSeries = transformSimpleLineData(
        simpleData!,
        title || 'Data'
      )[0];

      return {
        series: [transformedSeries],
        width,
        height,
        grid: grid || preset?.grid,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1500,
        colors,
        className,
        children,
        onDataPointClick,
        onDataPointHover
      };
    }, [
      mode,
      simpleData,
      title,
      theme,
      preset,
      width,
      height,
      grid,
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
        <div className={cn('radar-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedRadarChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedRadarChart
        ref={ref}
        series={series!}
        width={width}
        height={height}
        grid={grid}
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

const AdvancedRadarChart = forwardRef<SVGSVGElement, Omit<RadarChartProps, 'simpleData' | 'title' | 'theme'>>(
  (
    {
      series,
      width = 400,
      height = 400,
      grid = { enabled: true },
      legend = { enabled: true, position: 'top', align: 'center' },
      tooltip = { enabled: true, followCursor: false },
      animate = true,
      animationDuration = 1500,
      colors = DEFAULT_COLORS,
      className,
      children,
      onDataPointClick,
      onDataPointHover,
    },
    ref
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Calculate angles for each dimension
    const angleStep = (Math.PI * 2) / series[0]?.data.length || 0;

    const processedSeries = useMemo(() => {
      return series.map((s, index) => {
        const color = s.color || colors[index % colors.length];

        return {
          ...s,
          color,
        };
      });
    }, [series, colors]);

    return (
      <div
        className={cn(
          'relative inline-block',
          className
        )}
      >
        <svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label="Radar chart visualization"
        >
          <title>Radar Chart</title>
          <desc>
            Interactive radar chart displaying {series.length} data series
          </desc>

          {/* Grid circles */}
          {grid.enabled && (
            <g className="grid">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
                <circle
                  key={`grid-circle-${index}`}
                  cx={centerX}
                  cy={centerY}
                  r={radius * scale}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="1"
                  opacity={0.2}
                />
              ))}

              {/* Grid lines */}
              {series[0]?.data.map((_, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                return (
                  <line
                    key={`grid-line-${index}`}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="hsl(var(--muted))"
                    strokeWidth="1"
                    opacity={0.2}
                  />
                );
              })}
            </g>
          )}

          {/* Radar polygons */}
          {processedSeries.map((s, index) => {
            const points = s.data.map((d, i) => {
              const angle = angleStep * i - Math.PI / 2;
              const r = (d.y / 100) * radius;
              const x = centerX + r * Math.cos(angle);
              const y = centerY + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');

            return (
              <motion.polygon
                key={`radar-${s.id}`}
                points={points}
                fill={s.color}
                fillOpacity={0.3}
                stroke={s.color}
                strokeWidth={2}
                initial={animate ? { opacity: 0, scale: 0 } : {}}
                animate={animate ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: (animationDuration / 1000),
                  delay: index * 0.1
                }}
              />
            );
          })}

          {/* Data points */}
          {processedSeries.map((s) => {
            return s.data.map((d, i) => {
              const angle = angleStep * i - Math.PI / 2;
              const r = (d.y / 100) * radius;
              const x = centerX + r * Math.cos(angle);
              const y = centerY + r * Math.sin(angle);

              return (
                <circle
                  key={`point-${s.id}-${i}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={2}
                  className="cursor-pointer"
                  onClick={() => onDataPointClick?.({ ...d, seriesId: s.id })}
                />
              );
            });
          })}

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
            {processedSeries.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-sm text-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

RadarChart.displayName = 'RadarChart'
AdvancedRadarChart.displayName = 'AdvancedRadarChart'

// ============================================================================
// Default Props
// ============================================================================

RadarChart.defaultProps = {
  width: 400,
  height: 400,
  theme: 'business',
  animate: true
}

AdvancedRadarChart.defaultProps = {
  width: 400,
  height: 400,
  grid: { enabled: true },
  legend: { enabled: true, position: 'top', align: 'center' },
  tooltip: { enabled: true, followCursor: false },
  animate: true,
  animationDuration: 1500,
}

// ============================================================================
// Export
// ============================================================================

export default RadarChart
export { RadarChart, AdvancedRadarChart }

export type {
  RadarChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
