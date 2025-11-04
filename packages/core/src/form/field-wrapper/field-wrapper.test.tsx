/**
 * @fileoverview Field Wrapper 组件单元测试
 * @module components/form/field-wrapper/test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { FieldWrapper } from './field-wrapper';
import { Input } from '../input';

// 测试输入组件
const TestInput = React.forwardRef<HTMLInputElement, any>(
  ({ id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => (
    <input
      ref={ref}
      id={id}
      data-testid="test-input"
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  )
);
TestInput.displayName = 'TestInput';

describe('FieldWrapper', () => {
  describe('基础渲染', () => {
    it('应该正确渲染字段包装器', () => {
      render(
        <FieldWrapper label="测试字段">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByLabelText('测试字段')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('应该支持自定义 ID', () => {
      render(
        <FieldWrapper id="custom-id" label="测试字段">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByTestId('test-input')).toHaveAttribute('id', 'custom-id');
    });

    it('应该自动生成 ID 如果未提供', () => {
      render(
        <FieldWrapper label="测试字段">
          <TestInput />
        </FieldWrapper>
      );

      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('id');
      expect(input.id).toMatch(/^field-/);
    });

    it('应该渲染必填标识', () => {
      render(
        <FieldWrapper label="测试字段" isRequired>
          <TestInput />
        </FieldWrapper>
      );

      const label = screen.getByLabelText('测试字段');
      expect(label.parentElement).toHaveTextContent('*');
    });

    it('应该支持只读状态', () => {
      render(
        <FieldWrapper label="测试字段" isReadOnly>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByTestId('test-input')).toHaveAttribute('readonly');
    });
  });

  describe('尺寸变体', () => {
    it('应该支持 sm 尺寸', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" size="sm">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.py-tokens-space-2')).toBeInTheDocument();
    });

    it('应该支持 md 尺寸（默认）', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" size="md">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.py-tokens-space-3')).toBeInTheDocument();
    });

    it('应该支持 lg 尺寸', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" size="lg">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.py-tokens-space-4')).toBeInTheDocument();
    });
  });

  describe('变体样式', () => {
    it('应该支持 outline-solid 变体（默认）', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" variant="outline-solid">
          <TestInput />
        </FieldWrapper>
      );

      const input = container.querySelector('input');
      expect(input?.parentElement).toHaveClass('border-tokens-border-primary');
    });

    it('应该支持 outline-dashed 变体', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" variant="outline-dashed">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.querySelector('.border-dashed');
      expect(wrapper).toBeInTheDocument();
    });

    it('应该支持 filled 变体', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" variant="filled">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.querySelector('.bg-tokens-surface-secondary');
      expect(wrapper).toBeInTheDocument();
    });

    it('应该支持 ghost 变体', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" variant="ghost">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.querySelector('.border-0');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('密度设置', () => {
    it('应该支持 compact 密度', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" density="compact">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.space-y-1')).toBeInTheDocument();
    });

    it('应该支持 comfortable 密度（默认）', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" density="comfortable">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.space-y-2')).toBeInTheDocument();
    });

    it('应该支持 spacious 密度', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" density="spacious">
          <TestInput />
        </FieldWrapper>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelector('.space-y-4')).toBeInTheDocument();
    });
  });

  describe('消息文本', () => {
    it('应该显示帮助文本', () => {
      render(
        <FieldWrapper label="测试字段" helpText="这是帮助文本">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('这是帮助文本')).toBeInTheDocument();
    });

    it('应该显示错误消息', () => {
      render(
        <FieldWrapper label="测试字段" errorMessage="这是错误消息">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('这是错误消息')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('应该显示成功消息', () => {
      render(
        <FieldWrapper label="测试字段" successMessage="验证成功">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('验证成功')).toBeInTheDocument();
    });

    it('应该显示警告消息', () => {
      render(
        <FieldWrapper label="测试字段" warningMessage="这是警告">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('这是警告')).toBeInTheDocument();
    });

    it('应该优先显示错误消息而不是帮助文本', () => {
      render(
        <FieldWrapper
          label="测试字段"
          helpText="帮助文本"
          errorMessage="错误消息"
        >
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('错误消息')).toBeInTheDocument();
      expect(screen.queryByText('帮助文本')).not.toBeInTheDocument();
    });
  });

  describe('前后缀', () => {
    it('应该渲染前缀', () => {
      render(
        <FieldWrapper label="测试字段" prefix={<span>前缀</span>}>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('前缀')).toBeInTheDocument();
    });

    it('应该渲染后缀', () => {
      render(
        <FieldWrapper label="测试字段" suffix={<span>后缀</span>}>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('后缀')).toBeInTheDocument();
    });
  });

  describe('清除按钮', () => {
    it('应该显示清除按钮', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();

      render(
        <FieldWrapper label="测试字段" showClearButton onClear={handleClear}>
          <TestInput defaultValue="初始值" />
        </FieldWrapper>
      );

      const clearButton = screen.getByRole('button', { name: /清除字段内容/ });
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('在禁用状态下应该隐藏清除按钮', () => {
      render(
        <FieldWrapper label="测试字段" showClearButton isDisabled>
          <TestInput />
        </FieldWrapper>
      );

      expect(
        screen.queryByRole('button', { name: /清除字段内容/ })
      ).not.toBeInTheDocument();
    });

    it('在只读状态下应该隐藏清除按钮', () => {
      render(
        <FieldWrapper label="测试字段" showClearButton isReadOnly>
          <TestInput />
        </FieldWrapper>
      );

      expect(
        screen.queryByRole('button', { name: /清除字段内容/ })
      ).not.toBeInTheDocument();
    });
  });

  describe('加载状态', () => {
    it('应该显示加载指示器', () => {
      render(
        <FieldWrapper label="测试字段" isLoading>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByLabelText('加载中')).toBeInTheDocument();
    });

    it('在加载状态下应该隐藏清除按钮', () => {
      render(
        <FieldWrapper label="测试字段" showClearButton isLoading>
          <TestInput />
        </FieldWrapper>
      );

      expect(
        screen.queryByRole('button', { name: /清除字段内容/ })
      ).not.toBeInTheDocument();
    });
  });

  describe('焦点管理', () => {
    it('应该支持自动聚焦', () => {
      render(
        <FieldWrapper label="测试字段" autoFocus>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByTestId('test-input')).toHaveFocus();
    });

    it('应该处理焦点事件', () => {
      const handleFocus = vi.fn();
      render(
        <FieldWrapper label="测试字段" onFocus={handleFocus}>
          <TestInput />
        </FieldWrapper>
      );

      fireEvent.focus(screen.getByTestId('test-input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('应该处理失去焦点事件', () => {
      const handleBlur = vi.fn();
      render(
        <FieldWrapper label="测试字段" onBlur={handleBlur}>
          <TestInput />
        </FieldWrapper>
      );

      fireEvent.blur(screen.getByTestId('test-input'));
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('可访问性', () => {
    it('应该正确设置 aria-required 属性', () => {
      render(
        <FieldWrapper label="测试字段" isRequired>
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('应该正确设置 aria-invalid 属性', () => {
      render(
        <FieldWrapper label="测试字段" errorMessage="错误">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('应该设置 aria-describedby', () => {
      render(
        <FieldWrapper label="测试字段" errorMessage="错误信息">
          <TestInput />
        </FieldWrapper>
      );

      const input = screen.getByTestId('test-input');
      const messageId = input.getAttribute('aria-describedby');
      expect(messageId).toBeTruthy();
      expect(screen.getById(messageId!)).toBeInTheDocument();
    });

    it('消息区域应该使用 aria-live', () => {
      render(
        <FieldWrapper label="测试字段" errorMessage="错误信息">
          <TestInput />
        </FieldWrapper>
      );

      const message = screen.getByRole('status');
      expect(message).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('useFieldWrapper Hook', () => {
    it('在组件外调用应该抛出错误', () => {
      const { useFieldWrapper } = require('./field-wrapper');
      expect(() => {
        render(() => {
          useFieldWrapper();
          return null;
        });
      }).toThrow('useFieldWrapper must be used within a FieldWrapper component');
    });

    it('应该提供正确的上下文值', () => {
      let capturedContext: any;
      const TestComponent = () => {
        capturedContext = useFieldWrapper();
        return <TestInput />;
      };

      render(
        <FieldWrapper
          label="测试字段"
          size="lg"
          isDisabled
          isLoading
          errorMessage="错误"
        >
          <TestComponent />
        </FieldWrapper>
      );

      expect(capturedContext).toMatchObject({
        state: 'error',
        size: 'lg',
        isDisabled: true,
        isReadOnly: false,
        isLoading: true,
        fieldId: expect.any(String),
      });
    });
  });

  describe('状态优先级', () => {
    it('禁用状态应该覆盖其他状态', () => {
      render(
        <FieldWrapper
          label="测试字段"
          isDisabled
          isLoading
          errorMessage="错误"
          successMessage="成功"
        >
          <TestInput />
        </FieldWrapper>
      );

      const input = screen.getByTestId('test-input');
      expect(input.closest('.border-tokens-semantic-error-base')).toBeNull();
      expect(input.parentElement).toHaveClass('bg-tokens-surface-disabled');
    });

    it('加载状态应该覆盖错误状态', () => {
      render(
        <FieldWrapper label="测试字段" isLoading errorMessage="错误">
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByLabelText('加载中')).toBeInTheDocument();
    });

    it('错误消息应该覆盖成功消息', () => {
      render(
        <FieldWrapper
          label="测试字段"
          errorMessage="错误"
          successMessage="成功"
        >
          <TestInput />
        </FieldWrapper>
      );

      expect(screen.getByText('错误')).toBeInTheDocument();
      expect(screen.queryByText('成功')).not.toBeInTheDocument();
    });
  });

  describe('自定义类名', () => {
    it('应该应用自定义类名', () => {
      const { container } = render(
        <FieldWrapper label="测试字段" className="custom-class">
          <TestInput />
        </FieldWrapper>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
