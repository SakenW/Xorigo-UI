/**
 * @fileoverview AreaChart component - A flexible, animated area chart visualization
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

export interface AreaChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with series)
   * Format: [[x, y], [x, y]] or [{ x, y }, { x, y }]
   * @example
   * [['Jan', 4000], ['Feb', 3000], ['Mar', 5000]]
   * or
   * [{ x: 'Jan', y: 4000 }, { x: 'Feb', y: 3000 }]
   */
  simpleData?: Array<[string | number, number]> | Array<SimpleDataPoint>

  /**
   * Simple mode: Chart title
   */
  title?: string

  /**
   * Simple mode: X-axis label
   */
  xAxis?: string

  /**
   * Simple mode: Y-axis label
   */
  yAxis?: string

  /**
   * Simple mode: Preset theme
   * @default 'business'
   */
  theme?: SimpleTheme

  /**
   * Simple mode: Show area fill under the line
   * @default false
   */
  showArea?: boolean

  /**
   * Simple mode: Fill opacity for area
   * @default 0.6
   */
  fillOpacity?: number

  /**
   * === Advanced Mode ===
   * Data series for the area chart (mutually exclusive with simpleData)
   * @example
   * [
   *   {
   *     id: 'series-1',
   *     name: 'Revenue',
   *     data: [
   *       { x: 'Jan', y: 4000 },
   *       { x: 'Feb', y: 3000 },
   *       { x: 'Mar', y: 5000 }
   *     ],
   *     color: 'blue',
   *     smooth: true
   *   }
   * ]
   */
  series?: DataSeries[]

  /**
   * Chart dimensions
   */
  width?: number;
  height?: number;

  /**
   * Margin around the chart
   */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /**
   * Grid configuration
   */
  grid?: GridConfig;

  /**
   * Axis configuration
   */
  axis?: AxisConfig;

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

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const PATH_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        ease: 'easeInOut',
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
};

// Parse data values
const parseValue = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (value instanceof Date) return value.getTime();
  return 0;
};

// Generate smooth path from points
const generateSmoothPath = (
  points: Array<{ x: number; y: number }>
): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const path: string[] = [];
  path.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cp1x = current.x + (next.x - current.x) / 2;
    const cp1y = current.y;
    const cp2x = cp1x;
    const cp2y = next.y;

    path.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`);
  }

  return path.join(' ');
};

// Generate area path
const generateAreaPath = (
  points: Array<{ x: number; y: number }>,
  baseline: number = 0
): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${baseline} L ${points[0].x} ${points[0].y}`;

  const path: string[] = [];
  path.push(`M ${points[0].x} ${baseline}`);
  path.push(`L ${points[0].x} ${points[0].y}`);

  for (let i = 1; i < points.length; i++) {
    path.push(`L ${points[i].x} ${points[i].y}`);
  }

  path.push(`L ${points[points.length - 1].x} ${baseline}`);
  path.push('Z');

  return path.join(' ');
};

// Scale utilities
const createLinearScale = (
  domain: [number, number],
  range: [number, number]
): ((value: number) => number) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const slope = (r1 - r0) / (d1 - d0 || 1);
  return (value: number) => r0 + (value - d0) * slope;
};

// ============================================================================
// Advanced AreaChart Component (Core Implementation)
// ============================================================================

const AreaChart = forwardRef<SVGSVGElement, AreaChartProps>(
  (
    {
      simpleData,
      title,
      xAxis,
      yAxis,
      theme = 'business',
      showArea = true,
      fillOpacity = 0.6,
      series,
      width = 800,
      height = 400,
      margin = { top: 20, right: 30, bottom: 40, left: 50 },
      grid = { enabled: true },
      axis = {
        x: { enabled: true, tickCount: 5 },
        y: { enabled: true, tickCount: 5 },
      },
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
      throw new Error('AreaChart: Must provide either "simpleData" (simple mode) or "series" (advanced mode), but not both');
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
        title || yAxis || 'Data'
      )[0];

      return {
        series: [transformedSeries],
        width,
        height,
        margin,
        grid: grid || preset?.grid,
        axis: {
          ...(axis || preset?.axis),
          x: {
            ...(axis?.x || preset?.axis?.x),
            label: xAxis,
          },
          y: {
            ...(axis?.y || preset?.axis?.y),
            label: yAxis,
          }
        },
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
      yAxis,
      xAxis,
      theme,
      preset,
      width,
      height,
      margin,
      grid,
      axis,
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
        <div className={cn('area-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedAreaChart ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedAreaChart
        ref={ref}
        series={series!}
        width={width}
        height={height}
        margin={margin}
        grid={grid}
        axis={axis}
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

const AdvancedAreaChart = forwardRef<SVGSVGElement, Omit<AreaChartProps, 'simpleData' | 'title' | 'xAxis' | 'yAxis' | 'theme' | 'showArea'>>(
  (
    {
      series,
      width = 800,
      height = 400,
      margin = { top: 20, right: 30, bottom: 40, left: 50 },
      grid = { enabled: true },
      axis = {
        x: { enabled: true, tickCount: 5 },
        y: { enabled: true, tickCount: 5 },
      },
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
    // State
    const [hoveredPoint, setHoveredPoint] = useState<{
      seriesId: string;
      point: DataPoint;
      x: number;
      y: number;
    } | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);

    // Memoized calculations
    const chartDimensions = useMemo(() => {
      const innerWidth = width - (margin.left || 0) - (margin.right || 0);
      const innerHeight = height - (margin.top || 0) - (margin.bottom || 0);
      return { innerWidth, innerHeight };
    }, [width, height, margin]);

    const allData = useMemo(() => {
      return series.flatMap((s) => s.data.map((d) => ({ ...d, seriesId: s.id })));
    }, [series]);

    const xDomain = useMemo(() => {
      const values = allData.map((d) => parseValue(d.x));
      const min = Math.min(...values);
      const max = Math.max(...values);
      return [min, max];
    }, [allData]);

    const yDomain = useMemo(() => {
      const values = allData.map((d) => d.y);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.1;
      return [min - padding, max + padding];
    }, [allData]);

    const scales = useMemo(() => {
      const xScale = createLinearScale(
        xDomain,
        [margin.left || 0, chartDimensions.innerWidth + (margin.left || 0)]
      );
      const yScale = createLinearScale(
        [yDomain[1], yDomain[0]],
        [margin.top || 0, chartDimensions.innerHeight + (margin.top || 0)]
      );
      return { xScale, yScale };
    }, [xDomain, yDomain, margin, chartDimensions]);

    const processedSeries = useMemo(() => {
      return series.map((s, index) => {
        const points = s.data.map((d) => ({
          x: scales.xScale(parseValue(d.x)),
          y: scales.yScale(d.y),
          raw: d,
        }));

        const color = s.color || colors[index % colors.length];

        return {
          ...s,
          color,
          points,
        };
      });
    }, [series, scales, colors]);

    // Event handlers
    const handleMouseMove = useCallback(
      (event: React.MouseEvent<SVGSVGElement>) => {
        if (!tooltip.enabled) return;

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find nearest data point
        let nearest: {
          seriesId: string;
          point: DataPoint;
          x: number;
          y: number;
          distance: number;
        } | null = null;

        processedSeries.forEach((s) => {
          s.points.forEach((p) => {
            const distance = Math.sqrt(
              Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)
            );
            if (!nearest || distance < nearest.distance) {
              nearest = {
                seriesId: s.id,
                point: p.raw,
                x: p.x,
                y: p.y,
                distance,
              };
            }
          });
        });

        if (nearest && nearest.distance < 50) {
          const newHover = {
            seriesId: nearest.seriesId,
            point: nearest.point,
            x: nearest.x,
            y: nearest.y,
          };
          setHoveredPoint(newHover);
          onDataPointHover?.(newHover);
        } else if (hoveredPoint) {
          setHoveredPoint(null);
          onDataPointHover?.(null);
        }
      },
      [tooltip.enabled, processedSeries, onDataPointHover, hoveredPoint]
    );

    const handleMouseLeave = useCallback(() => {
      setHoveredPoint(null);
      onDataPointHover?.(null);
    }, [onDataPointHover]);

    const handlePointClick = useCallback(
      (event: React.MouseEvent, seriesId: string, point: DataPoint) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        onDataPointClick?.({
          seriesId,
          point,
          x,
          y,
        });
      },
      [onDataPointClick]
    );

    // Grid ticks
    const xTicks = useMemo(() => {
      if (!axis.x.enabled || !axis.x.tickCount) return [];
      const ticks: number[] = [];
      const step = chartDimensions.innerWidth / (axis.x.tickCount - 1);
      for (let i = 0; i < axis.x.tickCount; i++) {
        ticks.push((margin.left || 0) + i * step);
      }
      return ticks;
    }, [axis.x, chartDimensions, margin]);

    const yTicks = useMemo(() => {
      if (!axis.y.enabled || !axis.y.tickCount) return [];
      const ticks: number[] = [];
      const step = chartDimensions.innerHeight / (axis.y.tickCount - 1);
      for (let i = 0; i < axis.y.tickCount; i++) {
        ticks.push((margin.top || 0) + i * step);
      }
      return ticks;
    }, [axis.y, chartDimensions]);

    const xValues = useMemo(() => {
      if (!axis.x.enabled || !axis.x.tickCount) return [];
      const values: any[] = [];
      const step = (xDomain[1] - xDomain[0]) / (axis.x.tickCount - 1);
      for (let i = 0; i < axis.x.tickCount; i++) {
        values.push(xDomain[0] + i * step);
      }
      return values;
    }, [axis.x, xDomain]);

    const yValues = useMemo(() => {
      if (!axis.y.enabled || !axis.y.tickCount) return [];
      const values: number[] = [];
      const step = (yDomain[1] - yDomain[0]) / (axis.y.tickCount - 1);
      for (let i = 0; i < axis.y.tickCount; i++) {
        values.push(yDomain[0] + i * step);
      }
      return values;
    }, [axis.y, yDomain]);

    return (
      <div
        className={cn(
          'relative inline-block',
          className
        )}
      >
        <svg
          ref={(node) => {
            svgRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label="Area chart visualization"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <title>Area Chart</title>
          <desc>
            Interactive area chart displaying {series.length} data series
            with {allData.length} total data points
          </desc>

          <defs>
            <clipPath id="area-chart-clip">
              <rect
                x={margin.left || 0}
                y={margin.top || 0}
                width={chartDimensions.innerWidth}
                height={chartDimensions.innerHeight}
              />
            </clipPath>

            {processedSeries.map((s, index) => (
              <linearGradient
                key={`gradient-${s.id}`}
                id={`gradient-${s.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={s.color}
                  stopOpacity={s.area?.fillOpacity || 0.6}
                />
                <stop
                  offset="100%"
                  stopColor={s.color}
                  stopOpacity="0"
                />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          {grid.enabled && (
            <g className="grid">
              {grid.x?.enabled &&
                xTicks.map((x, i) => (
                  <line
                    key={`x-grid-${i}`}
                    x1={x}
                    y1={margin.top || 0}
                    x2={x}
                    y2={chartDimensions.innerHeight + (margin.top || 0)}
                    stroke={grid.color || 'hsl(var(--muted))'}
                    strokeWidth="1"
                    opacity={grid.opacity || 0.1}
                  />
                ))}
              {grid.y?.enabled &&
                yTicks.map((y, i) => (
                  <line
                    key={`y-grid-${i}`}
                    x1={margin.left || 0}
                    y1={y}
                    x2={chartDimensions.innerWidth + (margin.left || 0)}
                    y2={y}
                    stroke={grid.color || 'hsl(var(--muted))'}
                    strokeWidth="1"
                    opacity={grid.opacity || 0.1}
                  />
                ))}
            </g>
          )}

          {/* Area fills */}
          <g clipPath="url(#area-chart-clip)">
            {processedSeries.map((s, index) => {
              const areaPath = s.smooth
                ? generateSmoothPath(s.points)
                : s.points
                    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                    .join(' ');

              const fullAreaPath = generateAreaPath(s.points, scales.yScale(0));

              return (
                <motion.path
                  key={`area-${s.id}`}
                  d={fullAreaPath}
                  fill={`url(#gradient-${s.id})`}
                  initial="hidden"
                  animate={animate ? 'visible' : 'visible'}
                  variants={ANIMATION_VARIANTS}
                  custom={index}
                />
              );
            })}

            {/* Area strokes */}
            {processedSeries.map((s, index) => {
              const strokePath = s.smooth
                ? generateSmoothPath(s.points)
                : s.points
                    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                    .join(' ');

              return (
                <motion.path
                  key={`stroke-${s.id}`}
                  d={strokePath}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.strokeWidth || 2}
                  strokeDasharray={s.strokeDasharray}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial="hidden"
                  animate={animate ? 'visible' : 'visible'}
                  variants={PATH_VARIANTS}
                  custom={index}
                />
              );
            })}

            {/* Data points */}
            {processedSeries.map((s, index) =>
              s.points?.enabled
                ? s.points.map((p, pointIndex) => (
                    <motion.circle
                      key={`point-${s.id}-${pointIndex}`}
                      cx={p.x}
                      cy={p.y}
                      r={s.points?.radius || 4}
                      fill={s.color}
                      stroke="white"
                      strokeWidth="2"
                      className={cn(
                        'cursor-pointer transition-all duration-200',
                        hoveredPoint?.seriesId === s.id &&
                          hoveredPoint?.point === p.raw
                          ? 'opacity-100'
                          : 'opacity-80 hover:opacity-100'
                      )}
                      onClick={(e) => handlePointClick(e, s.id, p.raw)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={animate ? { opacity: 0.8, scale: 1 } : {}}
                      transition={{ delay: index * 0.1 + pointIndex * 0.01 }}
                      whileHover={{ r: s.points?.hoverRadius || 6 }}
                    />
                  ))
                : null
            )}
          </g>

          {/* Axes */}
          {axis.x.enabled && (
            <g className="x-axis">
              <line
                x1={margin.left || 0}
                y1={height - (margin.bottom || 0)}
                x2={width - (margin.right || 0)}
                y2={height - (margin.bottom || 0)}
                stroke="hsl(var(--foreground))"
                strokeWidth="1"
              />
              {xTicks.map((x, i) => (
                <text
                  key={`x-tick-${i}`}
                  x={x}
                  y={height - (margin.bottom || 0) + 20}
                  textAnchor="middle"
                  className="fill-sm text-foreground"
                  fontSize="12"
                >
                  {axis.x.tickFormat
                    ? axis.x.tickFormat(xValues[i])
                    : xValues[i]}
                </text>
              ))}
              {axis.x.label && (
                <text
                  x={width / 2}
                  y={height - 5}
                  textAnchor="middle"
                  className="fill-sm font-medium text-foreground"
                  fontSize="14"
                >
                  {axis.x.label}
                </text>
              )}
            </g>
          )}

          {axis.y.enabled && (
            <g className="y-axis">
              <line
                x1={margin.left || 0}
                y1={margin.top || 0}
                x2={margin.left || 0}
                y2={height - (margin.bottom || 0)}
                stroke="hsl(var(--foreground))"
                strokeWidth="1"
              />
              {yTicks.map((y, i) => (
                <text
                  key={`y-tick-${i}`}
                  x={(margin.left || 0) - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-sm text-foreground"
                  fontSize="12"
                >
                  {axis.y.tickFormat
                    ? axis.y.tickFormat(yValues[i])
                    : yValues[i]}
                </text>
              ))}
              {axis.y.label && (
                <text
                  transform={`translate(15, ${height / 2}) rotate(-90)`}
                  textAnchor="middle"
                  className="fill-sm font-medium text-foreground"
                  fontSize="14"
                >
                  {axis.y.label}
                </text>
              )}
            </g>
          )}

          {/* Tooltip */}
          {tooltip.enabled && hoveredPoint && (
            <foreignObject
              x={hoveredPoint.x + (tooltip.offset || 10)}
              y={hoveredPoint.y - 30}
              width="200"
              height="60"
              className="pointer-events-none"
            >
              <div
                className={cn(
                  'rounded-lg bg-popover p-3 shadow-lg border border-border',
                  'text-sm'
                )}
              >
                {tooltip.showSeries && (
                  <div className="font-medium mb-1">
                    {processedSeries.find((s) => s.id === hoveredPoint.seriesId)?.name}
                  </div>
                )}
                {tooltip.showValue !== false && (
                  <div className="text-muted-foreground">
                    Value: {hoveredPoint.point.y}
                  </div>
                )}
                {hoveredPoint.point.label && (
                  <div className="text-muted-foreground">
                    {hoveredPoint.point.label}
                  </div>
                )}
              </div>
            </foreignObject>
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

AreaChart.displayName = 'AreaChart'
AdvancedAreaChart.displayName = 'AdvancedAreaChart'

// ============================================================================
// Default Props
// ============================================================================

AreaChart.defaultProps = {
  width: 800,
  height: 400,
  theme: 'business',
  showArea: true,
  animate: true
}

AdvancedAreaChart.defaultProps = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 30, bottom: 40, left: 50 },
  grid: { enabled: true },
  axis: {
    x: { enabled: true, tickCount: 5 },
    y: { enabled: true, tickCount: 5 },
  },
  legend: { enabled: true, position: 'top', align: 'center' },
  tooltip: { enabled: true, followCursor: false },
  animate: true,
  animationDuration: 1500,
}

// ============================================================================
// Export
// ============================================================================

export default AreaChart
export { AreaChart, AdvancedAreaChart }

export type {
  AreaChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
