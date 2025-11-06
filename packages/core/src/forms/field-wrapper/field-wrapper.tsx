'use client'
/**
 * @fileoverview Field Wrapper 组件 - 字段包装器
 * @module components/form/field-wrapper
 */

import React, { useContext, useId, useRef, useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 字段包装器变体样式
 */
const fieldWrapperVariants = cva('w-full', {
  variants: {
    variant: {
      'outline-solid':
        'border border-tokens-border-primary rounded-tokens-radius-md px-tokens-space-3 py-tokens-space-2 transition-all duration-tokens-duration-150',
      'outline-dashed':
        'border-2 border-dashed border-tokens-border-primary rounded-tokens-radius-md px-tokens-space-3 py-tokens-space-2 transition-all duration-tokens-duration-150',
      filled:
        'bg-tokens-surface-secondary border-0 rounded-tokens-radius-md px-tokens-space-3 py-tokens-space-2 transition-all duration-tokens-duration-150',
      ghost:
        'border-0 rounded-tokens-radius-md px-tokens-space-3 py-tokens-space-2 transition-all duration-tokens-duration-150',
    },
    size: {
      sm: 'py-tokens-space-2 px-tokens-space-2 text-tokens-font-size-sm',
      md: 'py-tokens-space-3 px-tokens-space-3 text-tokens-font-size-md',
      lg: 'py-tokens-space-4 px-tokens-space-4 text-tokens-font-size-lg',
    },
    density: {
      compact: 'space-y-1',
      comfortable: 'space-y-2',
      spacious: 'space-y-4',
    },
    state: {
      default: '',
      focus: 'ring-2 ring-tokens-focus-ring ring-offset-2',
      error: 'border-tokens-semantic-error-base',
      success: 'border-tokens-semantic-success-base',
      warning: 'border-tokens-semantic-warning-base',
      disabled: 'bg-tokens-surface-disabled opacity-60 cursor-not-allowed',
      loading: 'opacity-70 cursor-wait',
    },
  },
  defaultVariants: {
    variant: 'outline-solid',
    size: 'md',
    density: 'comfortable',
    state: 'default',
  },
});

/**
 * 前缀/后缀包装器变体样式
 */
const affixVariants = cva(
  'flex items-center text-tokens-text-secondary transition-colors duration-tokens-duration-150',
  {
    variants: {
      size: {
        sm: 'text-tokens-font-size-sm',
        md: 'text-tokens-font-size-md',
        lg: 'text-tokens-font-size-lg',
      },
      state: {
        default: '',
        focus: 'text-tokens-text-primary',
        error: 'text-tokens-semantic-error-base',
        success: 'text-tokens-semantic-success-base',
        warning: 'text-tokens-semantic-warning-base',
        disabled: 'text-tokens-text-disabled',
        loading: 'text-tokens-text-secondary',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * 清除按钮变体样式
 */
const clearButtonVariants = cva(
  'absolute rounded-full p-1 transition-all duration-tokens-duration-150 hover:bg-tokens-surface-hover focus:outline-none focus:ring-2 focus:ring-tokens-focus-ring',
  {
    variants: {
      size: {
        sm: 'right-8 top-1/2 -translate-y-1/2',
        md: 'right-10 top-1/2 -translate-y-1/2',
        lg: 'right-12 top-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * 字段包装器组件属性
 */
export interface FieldWrapperProps extends VariantProps<typeof fieldWrapperVariants> {
  /**
   * 组件 ID，用于自动生成唯一标识符
   */
  id?: string;

  /**
   * 字段标签文本
   */
  label?: string;

  /**
   * 是否显示必填标识
   */
  isRequired?: boolean;

  /**
   * 帮助文本，提供额外说明
   */
  helpText?: string;

  /**
   * 错误消息文本
   */
  errorMessage?: string;

  /**
   * 成功消息文本
   */
  successMessage?: string;

  /**
   * 警告消息文本
   */
  warningMessage?: string;

  /**
   * 前缀内容
   */
  prefix?: React.ReactNode;

  /**
   * 后缀内容
   */
  suffix?: React.ReactNode;

  /**
   * 是否显示清除按钮
   */
  showClearButton?: boolean;

  /**
   * 清除按钮点击回调
   */
  onClear?: () => void;

  /**
   * 是否显示加载指示器
   */
  isLoading?: boolean;

  /**
   * 是否禁用
   */
  isDisabled?: boolean;

  /**
   * 是否只读
   */
  isReadOnly?: boolean;

  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 子组件，即输入控件
   */
  children?: React.ReactNode;

  /**
   * 组合状态回调
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * 失去焦点回调
   */
  onBlur?: (event: React.FocusEvent) => void;
}

/**
 * FieldWrapperContext - 字段包装器上下文
 */
export interface FieldWrapperContextValue {
  /**
   * 当前字段状态
   */
  state: 'default' | 'focus' | 'error' | 'success' | 'warning' | 'disabled' | 'loading';

  /**
   * 当前字段尺寸
   */
  size: 'sm' | 'md' | 'lg';

  /**
   * 是否禁用
   */
  isDisabled: boolean;

  /**
   * 是否只读
   */
  isReadOnly: boolean;

  /**
   * 是否加载中
   */
  isLoading: boolean;

  /**
   * 自动生成的 ID
   */
  fieldId: string;
}

const FieldWrapperContext = React.createContext<FieldWrapperContextValue | null>(null);

/**
 * 获取字段包装器上下文
 */
export function useFieldWrapper() {
  const context = useContext(FieldWrapperContext);
  if (!context) {
    throw new Error('useFieldWrapper must be used within a FieldWrapper component');
  }
  return context;
}

/**
 * 字段包装器组件
 */
export const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      id,
      label,
      isRequired,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      prefix,
      suffix,
      showClearButton,
      onClear,
      isLoading,
      isDisabled,
      isReadOnly,
      autoFocus,
      className,
      children,
      variant = 'outline-solid',
      size = 'md',
      density = 'comfortable',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    // 生成唯一 ID
    const generatedId = useId();
    const fieldId = id || `field-${generatedId}`;

    // 获取子组件引用
    const childRef = useRef<HTMLElement>(null);

    // 焦点状态管理
    const [isFocused, setIsFocused] = useState(autoFocus || false);

    // 确定当前状态
    let currentState: FieldWrapperContextValue['state'] = 'default';

    if (isDisabled) {
      currentState = 'disabled';
    } else if (isLoading) {
      currentState = 'loading';
    } else if (errorMessage) {
      currentState = 'error';
    } else if (successMessage) {
      currentState = 'success';
    } else if (warningMessage) {
      currentState = 'warning';
    } else if (isFocused) {
      currentState = 'focus';
    }

    // 焦点处理
    const handleFocus = (event: React.FocusEvent) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    // 上下文值
    const contextValue: FieldWrapperContextValue = {
      state: currentState,
      size,
      isDisabled,
      isReadOnly,
      isLoading,
      fieldId,
    };

    // 获取消息内容
    const message = errorMessage || successMessage || warningMessage || '';

    return (
      <FieldWrapperContext.Provider value={contextValue}>
        <div ref={ref} className={className}>
          {/* 字段标签 */}
          {label && (
            <label
              htmlFor={fieldId}
              className={`
                block text-tokens-text-primary font-medium
                ${size === 'sm' ? 'text-tokens-font-size-sm mb-1' : ''}
                ${size === 'md' ? 'text-tokens-font-size-md mb-2' : ''}
                ${size === 'lg' ? 'text-tokens-font-size-lg mb-2' : ''}
                ${isDisabled ? 'opacity-60' : ''}
              `}
            >
              {label}
              {isRequired && (
                <span className="ml-1 text-tokens-semantic-error-base" aria-label="必填">
                  *
                </span>
              )}
            </label>
          )}

          {/* 字段包装器 */}
          <div className="relative">
            {/* 前缀 */}
            {prefix && (
              <div
                className={`
                  absolute left-tokens-space-3 top-1/2 -translate-y-1/2 z-10
                  pointer-events-none
                `}
              >
                <div className={affixVariants({ size, state: currentState })}>
                  {prefix}
                </div>
              </div>
            )}

            {/* 子组件容器 */}
            <div className="relative">
              {/* 输入控件 */}
              <div
                className={fieldWrapperVariants({
                  variant,
                  size,
                  density,
                  state: currentState,
                })}
                {...props}
              >
                {React.cloneElement(children as React.ReactElement, {
                  id: fieldId,
                  disabled: isDisabled,
                  readOnly: isReadOnly,
                  'aria-required': isRequired,
                  'aria-invalid': Boolean(errorMessage),
                  'aria-describedby': message ? `${fieldId}-message` : undefined,
                  ref: childRef,
                  onFocus: handleFocus,
                  onBlur: handleBlur,
                  ...(React.isValidElement(children)
                    ? (children as any).props
                    : {}),
                })}
              </div>

              {/* 清除按钮 */}
              <AnimatePresence>
                {showClearButton && !isDisabled && !isReadOnly && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    type="button"
                    className={clearButtonVariants({ size })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear?.();
                      childRef.current?.focus();
                    }}
                    aria-label="清除字段内容"
                    tabIndex={-1}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* 加载指示器 */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className={`
                      absolute right-tokens-space-3 top-1/2 -translate-y-1/2 z-10
                      pointer-events-none
                    `}
                    aria-label="加载中"
                  >
                    <div className="w-4 h-4 border-2 border-tokens-border-secondary border-t-tokens-text-primary rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 后缀 */}
              {suffix && !isLoading && (
                <div
                  className={`
                    absolute right-tokens-space-3 top-1/2 -translate-y-1/2 z-10
                    pointer-events-none
                  `}
                >
                  <div className={affixVariants({ size, state: currentState })}>
                    {suffix}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 消息文本 */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                id={`${fieldId}-message`}
                className={`
                  text-tokens-font-size-sm mt-1
                  ${size === 'sm' ? 'mt-1' : ''}
                  ${size === 'md' ? 'mt-2' : ''}
                  ${size === 'lg' ? 'mt-3' : ''}
                  ${errorMessage ? 'text-tokens-semantic-error-base' : ''}
                  ${successMessage ? 'text-tokens-semantic-success-base' : ''}
                  ${warningMessage ? 'text-tokens-semantic-warning-base' : ''}
                `}
                role="status"
                aria-live="polite"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 帮助文本 */}
          <AnimatePresence>
            {helpText && !message && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-tokens-font-size-sm text-tokens-text-tertiary mt-1"
              >
                {helpText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FieldWrapperContext.Provider>
    );
  }
);

FieldWrapper.displayName = 'FieldWrapper';

export default FieldWrapper;
