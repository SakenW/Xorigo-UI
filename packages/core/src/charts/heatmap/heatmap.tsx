/**
 * @fileoverview Heatmap component - A flexible, animated heatmap visualization
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

export interface HeatmapDataPoint {
  x: string;
  y: string;
  value: number;
  [key: string]: any;
}

export interface HeatmapSeries {
  name: string;
  data: HeatmapDataPoint[];
  visible?: boolean;
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

export interface HeatmapProps {
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
  data?: HeatmapSeries[]

  /**
   * Chart size
   * @default 400
   */
  size?: number

  /**
   * Minimum value for color mapping
   * @default 自动计算
   */
  minValue?: number

  /**
   * Maximum value for color mapping
   * @default 自动计算
   */
  maxValue?: number

  /**
   * Whether to show value labels
   * @default false
   */
  showValues?: boolean

  /**
   * Whether to show grid
   * @default true
   */
  showGrid?: boolean

  /**
   * Cell gap
   * @default 2
   */
  cellGap?: number

  /**
   * Cell radius
   * @default 4
   */
  cellRadius?: number

  /**
   * Color palette
   * @default ['#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#ef4444']
   */
  colorScale?: string[]

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
  onCellClick?: (data: HeatmapDataPoint, series: HeatmapSeries) => void;
  onCellHover?: (data: HeatmapDataPoint | null, series: HeatmapSeries | null) => void;

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
// Heatmap Component
// ============================================================================

const Heatmap = forwardRef<SVGSVGElement, HeatmapProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      data,
      size = 400,
      minValue,
      maxValue,
      showValues = false,
      showGrid = true,
      cellGap = 2,
      cellRadius = 4,
      colorScale = [
        '#3b82f6',
        '#06b6d4',
        '#10b981',
        '#84cc16',
        '#eab308',
        '#f59e0b',
        '#ef4444'
      ],
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      className,
      children,
      onCellClick,
      onCellHover,
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
      throw new Error('Heatmap: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both');
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

      // Transform data to HeatmapSeries format
      const transformedData = transformSimplePieData(simpleData!).map((item, index) => ({
        name: item.name,
        data: [{
          x: item.name,
          y: 'Value',
          value: item.value
        }]
      }));

      return {
        data: transformedData,
        size,
        minValue,
        maxValue,
        showValues,
        showGrid,
        cellGap,
        cellRadius,
        colorScale,
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        className,
        children,
        onCellClick,
        onCellHover
      };
    }, [
      mode,
      simpleData,
      theme,
      preset,
      size,
      minValue,
      maxValue,
      showValues,
      showGrid,
      cellGap,
      cellRadius,
      colorScale,
      legend,
      tooltip,
      animate,
      animationDuration,
      className,
      children,
      onCellClick,
      onCellHover
    ]);

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('heatmap', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedHeatmap ref={ref} {...advancedModeProps!} />
        </div>
      );
    }

    // Render in advanced mode
    return (
      <AdvancedHeatmap
        ref={ref}
        data={data!}
        size={size}
        minValue={minValue}
        maxValue={maxValue}
        showValues={showValues}
        showGrid={showGrid}
        cellGap={cellGap}
        cellRadius={cellRadius}
        colorScale={colorScale}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        className={className}
        children={children}
        onCellClick={onCellClick}
        onCellHover={onCellHover}
      />
    );
  }
);

// Advanced Heatmap component (core implementation)
const AdvancedHeatmap = forwardRef<SVGSVGElement, Omit<HeatmapProps, 'simpleData' | 'title' | 'theme'>>(
  (
    {
      data,
      size = 400,
      minValue,
      maxValue,
      showValues = false,
      showGrid = true,
      cellGap = 2,
      cellRadius = 4,
      colorScale = [
        '#3b82f6',
        '#06b6d4',
        '#10b981',
        '#84cc16',
        '#eab308',
        '#f59e0b',
        '#ef4444'
      ],
      legend = { enabled: true, position: 'bottom', align: 'center' },
      tooltip = { enabled: true, showValue: true },
      animate = true,
      animationDuration = 1000,
      className,
      children,
      onCellClick,
      onCellHover,
    },
    ref
  ) => {
    const width = size;
    const height = size;
    const padding = 60;

    const [hoveredCell, setHoveredCell] = useState<{
      data: HeatmapDataPoint
      series: HeatmapSeries
      x: number
      y: number
    } | null>(null);

    // Process data and create matrix
    const matrixData = useMemo(() => {
      if (!data?.length) return { rows: [], columns: [], cells: [] };

      const allPoints = data.flatMap(series => series.data);

      const rows = Array.from(
        new Set(allPoints.map((point: HeatmapDataPoint) => point.y))
      ).sort();
      const columns = Array.from(
        new Set(allPoints.map((point: HeatmapDataPoint) => point.x))
      ).sort();

      const allValues = allPoints.map((p: HeatmapDataPoint) => p.value);
      const globalMin = minValue ?? Math.min(...allValues);
      const globalMax = maxValue ?? Math.max(...allValues);

      const cells: Array<{
        row: string
        column: string
        data: HeatmapDataPoint
        series: HeatmapSeries
        value: number
        normalizedValue: number
        color: string
      }> = [];

      data.forEach(series => {
        series.data.forEach((point: HeatmapDataPoint) => {
          const normalized = (point.value - globalMin) / (globalMax - globalMin);
          const colorIndex = Math.min(
            Math.floor(normalized * (colorScale.length - 1)),
            colorScale.length - 1
          );

          cells.push({
            row: point.y,
            column: point.x,
            data: point,
            series,
            value: point.value,
            normalizedValue: normalized,
            color: colorScale[colorIndex]
          });
        });
      });

      return { rows, columns, cells, globalMin, globalMax };
    }, [data, minValue, maxValue, colorScale]);

    const { rows, columns, cells, globalMin, globalMax } = matrixData;

    // Calculate cell dimensions
    const cellWidth = (width - padding * 2) / columns.length;
    const cellHeight = (height - padding * 2) / rows.length;

    // Event handlers
    const handleMouseEnter = (cellData: typeof cells[0], event: React.MouseEvent) => {
      if (!tooltip.enabled) return;

      setHoveredCell({
        data: cellData.data,
        series: cellData.series,
        x: event.clientX,
        y: event.clientY
      });

      onCellHover?.(cellData.data, cellData.series);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
      if (hoveredCell) {
        setHoveredCell(prev =>
          prev ? { ...prev, x: event.clientX, y: event.clientY } : null
        );
      }
    };

    const handleMouseLeave = () => {
      setHoveredCell(null);
      onCellHover?.(null, null);
    };

    const getCellPosition = (cell: typeof cells[0]) => {
      const rowIndex = rows.indexOf(cell.row);
      const colIndex = columns.indexOf(cell.column);

      return {
        x: padding + colIndex * cellWidth,
        y: padding + rowIndex * cellHeight
      };
    };

    if (!cells.length) {
      return (
        <div className={cn('flex items-center justify-center h-full text-muted-foreground', className)}>
          暂无数据
        </div>
      );
    }

    return (
      <div className={cn('relative inline-block', className)}>
        <svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label="Heatmap visualization"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <title>Heatmap</title>
          <desc>
            Heatmap displaying {cells.length} cells with value range from {globalMin} to {globalMax}
          </desc>

          {/* Grid lines */}
          {showGrid && (
            <>
              {columns.map((col, index) => {
                const x = padding + index * cellWidth;
                return (
                  <line
                    key={`v-grid-${index}`}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={height - padding}
                    stroke="hsl(var(--muted))"
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}

              {rows.map((row, index) => {
                const y = padding + index * cellHeight;
                return (
                  <line
                    key={`h-grid-${index}`}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="hsl(var(--muted))"
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}

              <rect
                x={padding}
                y={padding}
                width={width - padding * 2}
                height={height - padding * 2}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={1}
              />
            </>
          )}

          {/* Cells */}
          <AnimatePresence>
            {cells.map((cell, index) => {
              const pos = getCellPosition(cell);
              const x = pos.x + cellGap / 2;
              const y = pos.y + cellGap / 2;
              const cellWidthActual = cellWidth - cellGap;
              const cellHeightActual = cellHeight - cellGap;

              return (
                <motion.g
                  key={`${cell.series.name}-${cell.data.x}-${cell.data.y}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: animationDuration / 1000,
                    delay: index * 0.02
                  }}
                >
                  <motion.rect
                    x={x}
                    y={y}
                    width={cellWidthActual}
                    height={cellHeightActual}
                    fill={cell.color}
                    rx={cellRadius}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onMouseEnter={(e) => handleMouseEnter(cell, e as any)}
                    onClick={() => onCellClick?.(cell.data, cell.series)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />

                  {showValues && (
                    <motion.text
                      x={x + cellWidthActual / 2}
                      y={y + cellHeightActual / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={cn(
                        'text-xs font-medium pointer-events-none select-none',
                        cell.normalizedValue > 0.5
                          ? 'text-white'
                          : 'text-foreground'
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: animationDuration / 1000 + index * 0.02
                      }}
                    >
                      {cell.value}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* X-axis labels */}
          {columns.map((col, index) => {
            const x = padding + index * cellWidth + cellWidth / 2;
            return (
              <text
                key={`x-label-${index}`}
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {col}
              </text>
            );
          })}

          {/* Y-axis labels */}
          {rows.map((row, index) => {
            const y = padding + index * cellHeight + cellHeight / 2;
            return (
              <text
                key={`y-label-${index}`}
                x={padding - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-muted-foreground"
              >
                {row}
              </text>
            );
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {globalMin.toFixed(0)}
              </span>
              <div className="flex gap-1">
                {colorScale.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {globalMax.toFixed(0)}
              </span>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip.enabled && hoveredCell && (
          <div
            className="absolute pointer-events-none z-50 bg-popover border border-border rounded-lg p-3 shadow-lg"
            style={{
              left: hoveredCell.x,
              top: hoveredCell.y,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="font-medium text-foreground mb-1">
              {hoveredCell.data.x} × {hoveredCell.data.y}
            </div>
            <div className="text-sm text-muted-foreground">
              {hoveredCell.series.name}
            </div>
            <div className="text-sm font-medium text-foreground mt-1">
              Value: {hoveredCell.data.value}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Heatmap.displayName = 'Heatmap'
AdvancedHeatmap.displayName = 'AdvancedHeatmap'

// ============================================================================
// Default Props
// ============================================================================

Heatmap.defaultProps = {
  size: 400,
  theme: 'business',
  showValues: false,
  showGrid: true,
  cellGap: 2,
  cellRadius: 4,
  animate: true
}

AdvancedHeatmap.defaultProps = {
  size: 400,
  showValues: false,
  showGrid: true,
  cellGap: 2,
  cellRadius: 4,
  legend: { enabled: true, position: 'bottom', align: 'center' },
  tooltip: { enabled: true, showValue: true },
  animate: true,
  animationDuration: 1000,
}

// ============================================================================
// Export
// ============================================================================

export default Heatmap
export { Heatmap, AdvancedHeatmap }

export type {
  HeatmapProps,
  HeatmapDataPoint,
  HeatmapSeries,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
}
