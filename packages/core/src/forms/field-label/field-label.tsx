import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/**
 * FieldLabel组件的变体样式
 */
const fieldLabelVariants = cva(
  [
    'inline-flex items-center gap-1.5 font-medium transition-colors duration-200',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring)]',
  ],
  {
    variants: {
      variant: {
        default: 'text-[var(--foreground)]',
        secondary: 'text-[var(--muted-foreground)]',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      required: {
        true: "after:content-['*'] after:text-[var(--destructive)] after:ml-1",
      },
      disabled: {
        true: 'text-[var(--muted-foreground)] cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * FieldLabel组件的属性接口
 */
export interface FieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof fieldLabelVariants> {
  /**
   * 是否为必填字段
   */
  isRequired?: boolean;

  /**
   * 是否隐藏标签（屏幕阅读器可见）
   */
  isHidden?: boolean;

  /**
   * 关联的输入框ID
   */
  htmlFor?: string;

  /**
   * 标签图标
   */
  icon?: React.ReactNode;

  /**
   * 标签描述文本
   */
  description?: string;

  /**
   * 是否禁用状态
   */
  isDisabled?: boolean;

  /**
   * 自定义图标类名
   */
  iconClassName?: string;

  /**
   * 描述文本的类名
   */
  descriptionClassName?: string;

  /**
   * 点击时触发的函数
   */
  onClick?: (event: React.MouseEvent<HTMLLabelElement>) => void;
}

/**
 * FieldLabel组件 - 表单字段标签组件
 *
 * 功能特性：
 * - 支持必填标记显示
 * - 支持可选标记显示
 * - 支持隐藏标签（屏幕阅读器可见）
 * - 支持图标集成
 * - 支持自定义样式
 * - 支持禁用状态
 * - 支持点击聚焦关联输入框
 * - 支持HTML标签可配置
 * - 支持描述文本
 * - TypeScript 类型安全
 * - React Context 集成
 * - 可访问性支持
 */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      className,
      variant,
      size,
      isRequired = false,
      isHidden = false,
      htmlFor,
      icon,
      description,
      isDisabled = false,
      iconClassName,
      descriptionClassName,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
      // 避免在禁用状态下触发
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      // 尝试聚焦关联的输入框
      if (htmlFor && !isDisabled) {
        const input = document.getElementById(htmlFor);
        if (input && typeof input.focus === 'function') {
          input.focus();
        }
      }

      // 调用用户自定义的点击处理器
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          fieldLabelVariants({
            variant,
            size,
            required: isRequired,
            disabled: isDisabled,
          }),
          className
        )}
        onClick={handleClick}
        aria-hidden={isHidden}
        aria-disabled={isDisabled}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'inline-flex items-center justify-center',
              isDisabled && 'text-[var(--muted-foreground)]',
              iconClassName
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <span className={cn(isHidden && 'sr-only')}>
          {children}
        </span>

        {description && (
          <span
            className={cn(
              'block text-xs text-[var(--muted-foreground)] mt-0.5 font-normal',
              descriptionClassName
            )}
            aria-describedby={props.id}
          >
            {description}
          </span>
        )}
      </label>
    );
  }
);

FieldLabel.displayName = 'FieldLabel';

/**
 * FieldLabelDescription组件 - 字段标签的描述文本组件
 */
export const FieldLabelDescription = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    /**
     * 描述文本的ID，用于关联输入框
     */
    id?: string;
  }
>(({ className, children, id, ...props }, ref) => {
  return (
    <span
      ref={ref}
      id={id}
      className={cn(
        'block text-xs text-[var(--muted-foreground)] mt-0.5 font-normal',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

FieldLabelDescription.displayName = 'FieldLabelDescription';
