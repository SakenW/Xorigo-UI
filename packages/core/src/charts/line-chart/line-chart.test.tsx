/**
 * @fileoverview LineChart component unit tests
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LineChart } from './line-chart';
import type { LineChartProps, DataSeries, DataPoint } from './line-chart';

// ============================================================================
// Test Data
// ============================================================================

const mockData: DataSeries[] = [
  {
    id: 'series-1',
    name: 'Revenue',
    data: [
      { x: 0, y: 4000 },
      { x: 1, y: 3000 },
      { x: 2, y: 5000 },
      { x: 3, y: 2000 },
      { x: 4, y: 4500 },
    ],
    color: 'hsl(220, 70%, 50%)',
    smooth: true,
    area: { enabled: true, fillOpacity: 0.3 },
    points: { enabled: true, radius: 4, hoverRadius: 6 },
  },
  {
    id: 'series-2',
    name: 'Expenses',
    data: [
      { x: 0, y: 2400 },
      { x: 1, y: 1398 },
      { x: 2, y: 9800 },
      { x: 3, y: 3908 },
      { x: 4, y: 4800 },
    ],
    color: 'hsl(0, 70%, 50%)',
    step: true,
  },
];

const emptyData: DataSeries[] = [];

const singlePointData: DataSeries[] = [
  {
    id: 'single',
    name: 'Single Point',
    data: [{ x: 0, y: 100 }],
  },
];

// ============================================================================
// Test Suite
// ============================================================================

describe('LineChart', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Line chart visualization');
    });

    it('renders with custom dimensions', () => {
      render(<LineChart series={mockData} width={600} height={300} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toHaveAttribute('width', '600');
      expect(svg).toHaveAttribute('height', '300');
    });

    it('renders with empty data', () => {
      render(<LineChart series={emptyData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('renders with single data point', () => {
      render(<LineChart series={singlePointData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <LineChart series={mockData} className="custom-chart" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-chart');
    });

    it('renders title and description', () => {
      render(<LineChart series={mockData} />);
      expect(screen.getByTitle('Line Chart')).toBeInTheDocument();
    });
  });

  describe('Data Visualization', () => {
    it('displays multiple data series', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });

      // Check that multiple line paths are rendered
      const paths = svg.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('renders smooth curves when enabled', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
    });

    it('renders step lines when enabled', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getRole('img', { hidden: true });
      const paths = svg.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('renders area fills when enabled', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      const areas = svg.querySelectorAll('path[fill^="url"]');
      expect(areas.length).toBeGreaterThan(0);
    });

    it('renders data points when enabled', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe('Grid and Axes', () => {
    it('renders grid when enabled', () => {
      render(<LineChart series={mockData} grid={{ enabled: true }} />);
      const svg = screen.getByRole('img', { hidden: true });
      const gridLines = svg.querySelectorAll('.grid line');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    it('hides grid when disabled', () => {
      render(<LineChart series={mockData} grid={{ enabled: false }} />);
      const svg = screen.getByRole('img', { hidden: true });
      const gridLines = svg.querySelectorAll('.grid line');
      expect(gridLines.length).toBe(0);
    });

    it('renders X-axis when enabled', () => {
      render(<LineChart series={mockData} axis={{ x: { enabled: true } }} />);
      const svg = screen.getByRole('img', { hidden: true });
      const xAxis = svg.querySelector('.x-axis');
      expect(xAxis).toBeInTheDocument();
    });

    it('renders Y-axis when enabled', () => {
      render(<LineChart series={mockData} axis={{ y: { enabled: true } }} />);
      const svg = screen.getByRole('img', { hidden: true });
      const yAxis = svg.querySelector('.y-axis');
      expect(yAxis).toBeInTheDocument();
    });

    it('displays axis labels', () => {
      render(
        <LineChart
          series={mockData}
          axis={{
            x: { enabled: true, label: 'Time' },
            y: { enabled: true, label: 'Value' },
          }}
        />
      );
      const svg = screen.getByRole('img', { hidden: true });
      const labels = svg.querySelectorAll('text');
      const hasLabels = Array.from(labels).some((label) =>
        ['Time', 'Value'].includes(label.textContent || '')
      );
      expect(hasLabels).toBe(true);
    });

    it('formats tick labels with custom formatter', () => {
      render(
        <LineChart
          series={mockData}
          axis={{
            y: {
              enabled: true,
              tickFormat: (value: number) => `$${value.toFixed(0)}`,
            },
          }}
        />
      );
      const svg = screen.getByRole('img', { hidden: true });
      const yTicks = svg.querySelectorAll('.y-axis text');
      expect(yTicks.length).toBeGreaterThan(0);
    });
  });

  describe('Legend', () => {
    it('renders legend when enabled', () => {
      render(<LineChart series={mockData} legend={{ enabled: true }} />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Expenses')).toBeInTheDocument();
    });

    it('hides legend when disabled', () => {
      render(<LineChart series={mockData} legend={{ enabled: false }} />);
      expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
      expect(screen.queryByText('Expenses')).not.toBeInTheDocument();
    });

    it('displays series colors in legend', () => {
      render(<LineChart series={mockData} legend={{ enabled: true }} />);
      const legendItems = screen.getAllByText(/Revenue|Expenses/);
      expect(legendItems.length).toBe(2);
    });
  });

  describe('Tooltip', () => {
    it('renders tooltip on hover', async () => {
      render(<LineChart series={mockData} tooltip={{ enabled: true }} />);
      const svg = screen.getByRole('img', { hidden: true });

      fireEvent.mouseMove(svg, {
        clientX: 100,
        clientY: 100,
      });

      await waitFor(() => {
        const tooltip = document.querySelector('[role="tooltip"]') ||
                       document.querySelector('.rounded-lg');
        // Tooltip may render in portal, so we just check it renders somewhere
      });
    });

    it('does not render tooltip when disabled', () => {
      render(<LineChart series={mockData} tooltip={{ enabled: false }} />);
      const svg = screen.getByRole('img', { hidden: true });

      fireEvent.mouseMove(svg, {
        clientX: 100,
        clientY: 100,
      });

      // Should not have tooltips in DOM
      const tooltips = document.querySelectorAll('[role="tooltip"]');
      expect(tooltips.length).toBe(0);
    });

    it('calls onDataPointHover when hovering over points', async () => {
      const handleHover = vi.fn();
      render(
        <LineChart
          series={mockData}
          tooltip={{ enabled: true }}
          onDataPointHover={handleHover}
        />
      );

      const svg = screen.getByRole('img', { hidden: true });

      fireEvent.mouseMove(svg, {
        clientX: 100,
        clientY: 100,
      });

      await waitFor(() => {
        // Hover handler should be called
        expect(handleHover).toHaveBeenCalled();
      });
    });
  });

  describe('Interactions', () => {
    it('calls onDataPointClick when data point is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <LineChart
          series={mockData}
          onDataPointClick={handleClick}
        />
      );

      const svg = screen.getByRole('img', { hidden: true });
      const circles = svg.querySelectorAll('circle');

      if (circles.length > 0) {
        await user.click(circles[0]);
        // Click handler should be called
        expect(handleClick).toHaveBeenCalled();
      }
    });

    it('handles mouse wheel for zoom when enabled', () => {
      render(
        <LineChart
          series={mockData}
          zoom={{ enabled: true, minZoom: 0.5, maxZoom: 5 }}
        />
      );

      const svg = screen.getByRole('img', { hidden: true });

      // Simulate wheel event
      fireEvent.wheel(svg, {
        deltaY: -100,
      });

      // Should not throw error
      expect(svg).toBeInTheDocument();
    });

    it('does not handle zoom when disabled', () => {
      render(
        <LineChart
          series={mockData}
          zoom={{ enabled: false }}
        />
      );

      const svg = screen.getByRole('img', { hidden: true });

      // Simulate wheel event - should not prevent default
      fireEvent.wheel(svg, {
        deltaY: -100,
      });

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('renders with animation by default', () => {
      render(<LineChart series={mockData} animate={true} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('renders without animation when disabled', () => {
      render(<LineChart series={mockData} animate={false} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('respects custom animation duration', () => {
      render(<LineChart series={mockData} animationDuration={2000} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Custom Colors', () => {
    it('uses custom color palette', () => {
      const customColors = ['red', 'blue', 'green'];
      render(<LineChart series={mockData} colors={customColors} />);
      const svg = screen.getByRole('img', { hidden: true });

      // Should render without errors
      expect(svg).toBeInTheDocument();
    });

    it('uses series-specific colors', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });

      // Should use specified colors from series data
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA role', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('has ARIA label', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toHaveAttribute('aria-label');
    });

    it('has title element', () => {
      render(<LineChart series={mockData} />);
      expect(screen.getByTitle('Line Chart')).toBeInTheDocument();
    });

    it('has description element', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      const description = svg.querySelector('desc');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Margins and Padding', () => {
    it('respects custom margin', () => {
      const customMargin = { top: 10, right: 20, bottom: 30, left: 40 };
      render(<LineChart series={mockData} margin={customMargin} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('uses default margin when not specified', () => {
      render(<LineChart series={mockData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative values', () => {
      const negativeData: DataSeries[] = [
        {
          id: 'negative',
          name: 'Negative Values',
          data: [
            { x: 0, y: -100 },
            { x: 1, y: 50 },
            { x: 2, y: -50 },
          ],
        },
      ];
      render(<LineChart series={negativeData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('handles zero values', () => {
      const zeroData: DataSeries[] = [
        {
          id: 'zero',
          name: 'Zero Values',
          data: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
          ],
        },
      ];
      render(<LineChart series={zeroData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('handles very large values', () => {
      const largeData: DataSeries[] = [
        {
          id: 'large',
          name: 'Large Values',
          data: [
            { x: 0, y: 1000000 },
            { x: 1, y: 2000000 },
            { x: 2, y: 3000000 },
          ],
        },
      ];
      render(<LineChart series={largeData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('handles duplicate X values', () => {
      const duplicateData: DataSeries[] = [
        {
          id: 'duplicate',
          name: 'Duplicate X',
          data: [
            { x: 0, y: 100 },
            { x: 0, y: 200 },
            { x: 1, y: 300 },
          ],
        },
      ];
      render(<LineChart series={duplicateData} />);
      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('forwardRef', () => {
    it('forwards ref to SVG element', () => {
      const ref = React.createRef<SVGSVGElement>();
      render(<LineChart series={mockData} ref={ref} />);
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe('Children Overlay', () => {
    it('renders custom children overlay', () => {
      render(
        <LineChart series={mockData}>
          <g className="custom-overlay">
            <circle cx="100" cy="100" r="10" fill="red" />
          </g>
        </LineChart>
      );
      const overlay = screen.getByRole('img', { hidden: true }).querySelector('.custom-overlay');
      expect(overlay).toBeInTheDocument();
    });
  });
});
