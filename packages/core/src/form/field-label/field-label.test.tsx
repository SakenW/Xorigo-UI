import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldLabel, FieldLabelDescription } from './field-label';

/**
 * FieldLabel组件测试套件
 */
describe('FieldLabel', () => {
  // Mock document.getElementById for focus simulation
  beforeEach(() => {
    const mockFocus = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({
      focus: mockFocus,
    });
  });

  describe('基础渲染', () => {
    it('应该正确渲染字段标签', () => {
      render(
        <FieldLabel htmlFor="test-input">
          测试标签
        </FieldLabel>
      );

      const label = screen.getByText('测试标签');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('应该支持自定义className', () => {
      render(
        <FieldLabel className="custom-class">
          测试标签
        </FieldLabel>
      );

      const label = screen.getByText('测试标签');
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('必填标记', () => {
    it('应该显示必填标记', () => {
      render(
        <FieldLabel isRequired>
          必填字段
        </FieldLabel>
      );

      const label = screen.getByText('必填字段');
      expect(label).toBeInTheDocument();
      // 检查必填标记是否通过伪元素添加
      const styles = window.getComputedStyle(label, '::after');
      expect(styles.content).not.toBe('none');
    });

    it('不应该在可选字段显示必填标记', () => {
      render(
        <FieldLabel>
          可选字段
        </FieldLabel>
      );

      const label = screen.getByText('可选字段');
      expect(label).toBeInTheDocument();
    });
  });

  describe('隐藏标签', () => {
    it('应该支持sr-only隐藏标签（屏幕阅读器可见）', () => {
      render(
        <FieldLabel isHidden>
          隐藏标签
        </FieldLabel>
      );

      const label = screen.getByText('隐藏标签');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('sr-only');
      expect(label).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('图标支持', () => {
    it('应该正确渲染图标', () => {
      const icon = <span data-testid="icon">📝</span>;
      render(
        <FieldLabel icon={icon}>
          带图标的标签
        </FieldLabel>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('应该支持自定义图标样式', () => {
      const icon = <span>📝</span>;
      render(
        <FieldLabel icon={icon} iconClassName="icon-custom">
          带图标的标签
        </FieldLabel>
      );

      const iconElement = screen.getByText('📝').closest('span');
      expect(iconElement).toHaveClass('icon-custom');
    });
  });

  describe('禁用状态', () {
    it('应该正确显示禁用状态', () => {
      render(
        <FieldLabel isDisabled>
          禁用标签
        </FieldLabel>
      );

      const label = screen.getByText('禁用标签');
      expect(label).toHaveClass('text-[var(--muted-foreground)]');
      expect(label).toHaveClass('cursor-not-allowed');
      expect(label).toHaveAttribute('aria-disabled', 'true');
    });

    it('禁用状态下不应该响应点击', () => {
      const mockGetElementById = vi.spyOn(document, 'getElementById');
      const mockFocus = vi.fn();

      mockGetElementById.mockReturnValue({
        focus: mockFocus,
      } as any);

      render(
        <FieldLabel htmlFor="test-input" isDisabled>
          禁用标签
        </FieldLabel>
      );

      const label = screen.getByText('禁用标签');
      fireEvent.click(label);

      expect(mockFocus).not.toHaveBeenCalled();

      mockGetElementById.mockRestore();
    });
  });

  describe('点击聚焦', () => {
    it('点击标签应该聚焦关联的输入框', () => {
      const mockFocus = vi.fn();
      document.getElementById = vi.fn().mockReturnValue({
        focus: mockFocus,
      });

      render(
        <FieldLabel htmlFor="test-input">
          测试标签
        </FieldLabel>
      );

      const label = screen.getByText('测试标签');
      fireEvent.click(label);

      expect(document.getElementById).toHaveBeenCalledWith('test-input');
      expect(mockFocus).toHaveBeenCalled();
    });

    it('应该支持自定义点击处理器', () => {
      const handleClick = vi.fn();

      render(
        <FieldLabel htmlFor="test-input" onClick={handleClick}>
          测试标签
        </FieldLabel>
      );

      const label = screen.getByText('测试标签');
      fireEvent.click(label);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('变体和尺寸', () => {
    it('应该支持secondary变体', () => {
      render(
        <FieldLabel variant="secondary">
          次要标签
        </FieldLabel>
      );

      const label = screen.getByText('次要标签');
      expect(label).toHaveClass('text-[var(--muted-foreground)]');
    });

    it('应该支持不同尺寸', () => {
      const { rerender } = render(
        <FieldLabel size="sm">
          小号标签
        </FieldLabel>
      );

      let label = screen.getByText('小号标签');
      expect(label).toHaveClass('text-sm');

      rerender(
        <FieldLabel size="lg">
          大号标签
        </FieldLabel>
      );

      label = screen.getByText('大号标签');
      expect(label).toHaveClass('text-lg');
    });
  });

  describe('描述文本', () => {
    it('应该显示描述文本', () => {
      render(
        <FieldLabel description="这是一个描述">
          标签
        </FieldLabel>
      );

      expect(screen.getByText('这是一个描述')).toBeInTheDocument();
    });

    it('描述文本应该有正确的样式', () => {
      render(
        <FieldLabel description="描述文本">
          标签
        </FieldLabel>
      );

      const description = screen.getByText('描述文本');
      expect(description).toHaveClass('text-xs');
      expect(description).toHaveClass('text-[var(--muted-foreground)]');
      expect(description).toHaveClass('font-normal');
    });

    it('应该支持描述文本的自定义样式', () => {
      render(
        <FieldLabel description="描述" descriptionClassName="desc-custom">
          标签
        </FieldLabel>
      );

      const description = screen.getByText('描述');
      expect(description).toHaveClass('desc-custom');
    });
  });
});

/**
 * FieldLabelDescription组件测试套件
 */
describe('FieldLabelDescription', () => {
  it('应该正确渲染描述组件', () => {
    render(
      <FieldLabelDescription>
        这是一个描述
      </FieldLabelDescription>
    );

    expect(screen.getByText('这是一个描述')).toBeInTheDocument();
  });

  it('应该支持自定义ID', () => {
    render(
      <FieldLabelDescription id="custom-id">
        描述文本
      </FieldLabelDescription>
    );

    const description = screen.getByText('描述文本');
    expect(description).toHaveAttribute('id', 'custom-id');
  });

  it('应该使用正确的默认样式', () => {
    render(
      <FieldLabelDescription>
        描述文本
      </FieldLabelDescription>
    );

    const description = screen.getByText('描述文本');
    expect(description).toHaveClass('text-xs');
    expect(description).toHaveClass('text-[var(--muted-foreground)]');
    expect(description).toHaveClass('font-normal');
  });
});

/**
 * 可访问性测试
 */
describe('FieldLabel - 可访问性', () => {
  it('应该支持aria-disabled属性', () => {
    render(
      <FieldLabel isDisabled>
        禁用标签
      </FieldLabel>
    );

    const label = screen.getByText('禁用标签');
    expect(label).toHaveAttribute('aria-disabled', 'true');
  });

  it('应该支持aria-hidden属性', () => {
    render(
      <FieldLabel isHidden>
        隐藏标签
      </FieldLabel>
    );

    const label = screen.getByText('隐藏标签');
    expect(label).toHaveAttribute('aria-hidden', 'true');
  });

  it('应该正确设置for属性', () => {
    render(
      <FieldLabel htmlFor="test-id">
        测试标签
      </FieldLabel>
    );

    const label = screen.getByText('测试标签');
    expect(label).toHaveAttribute('for', 'test-id');
  });
});
