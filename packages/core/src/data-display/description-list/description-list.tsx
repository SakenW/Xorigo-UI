'use client'
/**
 * @fileoverview Description List Component - 描述列表组件
 * @description 支持术语和定义展示的灵活列表组件，提供多种布局和交互模式
 * @author Xorigo UI Team
 * @version 1.0.0
 */


import React, {
  forwardRef,
  useState,
  useMemo,
  isValidElement,
  createElement,
  ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cva-standalone';
import { Copy, Check, ChevronDown, ChevronRight, Hash } from 'lucide-react';

// ============================================================================
// 变体配置
// ============================================================================

const descriptionListVariants = cva(
  'group/description-list',
  {
    variants: {
      variant: {
        vertical: 'flex flex-col gap-2',
        horizontal: 'grid grid-cols-2 gap-4',
        auto: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      density: {
        compact: 'gap-2',
        normal: 'gap-4',
        comfortable: 'gap-6',
      },
    },
    defaultVariants: {
      variant: 'auto',
      size: 'md',
      density: 'normal',
    },
  }
);

const termVariants = cva(
  'font-medium text-foreground',
  {
    variants: {
      size: {
        sm: 'text-sm font-medium',
        md: 'text-base font-semibold',
        lg: 'text-lg font-bold',
      },
      emphasis: {
        normal: 'text-foreground',
        strong: 'text-foreground-strong',
        subtle: 'text-foreground-muted',
      },
    },
    defaultVariants: {
      size: 'md',
      emphasis: 'normal',
    },
  }
);

const descriptionVariants = cva(
  'text-foreground-muted',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// ============================================================================
// 类型定义
// ============================================================================

export interface DescriptionListItem {
  term: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  id?: string;
  className?: string;
  termClassName?: string;
  descriptionClassName?: string;
  copyable?: boolean;
  onCopy?: (value: string) => void;
  value?: string;
}

export interface DescriptionListGroup {
  title?: ReactNode;
  items: DescriptionListItem[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: ReactNode;
}

export interface DescriptionListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof descriptionListVariants> {
  items: DescriptionListItem[];
  groups?: DescriptionListGroup[];
  label?: ReactNode;
  showIcons?: boolean;
  showDividers?: boolean;
  copyable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onItemCopy?: (item: DescriptionListItem) => void;
  renderCustomItem?: (item: DescriptionListItem, index: number) => ReactNode;
  ariaLabel?: string;
}

// ============================================================================
// 工具函数
// ============================================================================

const getNodeText = (node: ReactNode): string => {
  if (node == null) return '';

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (isValidElement(node)) {
    if (node.props && typeof node.props.children !== 'undefined') {
      return getNodeText(node.props.children);
    }
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }

  return '';
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

// ============================================================================
// 子组件
// ============================================================================

interface TermProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  emphasis?: 'normal' | 'strong' | 'subtle';
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

const Term = forwardRef<HTMLDivElement, TermProps>(
  ({ children, size, emphasis, className, icon, onClick }, ref) => {
    const isClickable = !!onClick;

    return (
      <div
        ref={ref}
        className={cn(
          termVariants({ size, emphasis }),
          'flex items-center gap-2',
          isClickable && 'cursor-pointer hover:text-foreground-strong transition-colors',
          className
        )}
        onClick={onClick}
      >
        {icon && (
          <span className="inline-flex flex-shrink-0">
            {icon}
          </span>
        )}
        {isClickable ? (
          <button
            className="flex-1 text-left hover:underline"
            onClick={onClick}
            type="button"
          >
            {children}
          </button>
        ) : (
          <span className="flex-1">{children}</span>
        )}
      </div>
    );
  }
);

Term.displayName = 'Term';

interface DescriptionProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  ({ children, size, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(descriptionVariants({ size }), className)}
      >
        {children}
      </div>
    );
  }
);

Description.displayName = 'Description';

interface CopyButtonProps {
  value: string;
  onCopy?: (value: string) => void;
  className?: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, onCopy, className }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
      const success = await copyToClipboard(value);

      if (success) {
        setCopied(true);
        onCopy?.(value);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          'opacity-0 group-hover/description-item:opacity-100',
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
          'text-xs font-medium text-foreground-muted',
          'hover:text-foreground hover:bg-background-secondary',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          copied && 'text-green-600',
          className
        )}
        aria-label={copied ? '已复制' : '复制内容'}
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>已复制</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>复制</span>
          </>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';

// ============================================================================
// 主组件
// ============================================================================

export const DescriptionList = forwardRef<HTMLDivElement, DescriptionListProps>(
  (
    {
      items,
      groups,
      label,
      showIcons = false,
      showDividers = false,
      copyable = false,
      collapsible = false,
      defaultCollapsed = false,
      onItemCopy,
      renderCustomItem,
      ariaLabel,
      variant,
      size,
      density,
      className,
      ...props
    },
    ref
  ) => {
    const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
      new Set(defaultCollapsed && groups ? groups.map((_, index) => index) : [])
    );

    const toggleGroup = (index: number) => {
      setCollapsedGroups(prev => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    };

    const renderItem = (item: DescriptionListItem, index: number) => {
      const nodeText = item.value || getNodeText(item.term) || getNodeText(item.description);
      const isCollapsed = false;

      return (
        <motion.div
          key={item.id || index}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'flex flex-col md:flex-row',
            'group/description-item',
            'p-3 md:p-4 rounded-lg',
            'hover:bg-background-secondary',
            'transition-colors duration-200',
            'relative',
            variant === 'horizontal' && 'md:flex-row',
            variant === 'vertical' && 'flex-col',
            variant === 'auto' && 'md:flex-row',
            className
          )}
          {...props}
        >
          <div className="flex-1 min-w-0">
            {variant === 'vertical' ? (
              <div className="flex flex-col gap-1.5">
                <Term
                  size={size}
                  icon={showIcons && item.icon}
                >
                  {item.term}
                </Term>
                <Description
                  size={size}
                  className={cn(
                    'pl-4 md:pl-6',
                    showIcons && 'pl-6 md:pl-8'
                  )}
                >
                  {item.description}
                </Description>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
                <Term
                  size={size}
                  emphasis="strong"
                  icon={showIcons && item.icon}
                  className="flex-shrink-0 md:min-w-[200px]"
                >
                  {item.term}
                </Term>
                <div className="flex-1 min-w-0 flex items-start gap-2">
                  <span className="text-foreground-muted hidden md:inline">:</span>
                  <Description
                    size={size}
                    className="flex-1 min-w-0"
                  >
                    {item.description}
                  </Description>
                </div>
              </div>
            )}
          </div>

          {(copyable || item.copyable) && nodeText && (
            <CopyButton
              value={nodeText}
              onCopy={onItemCopy}
              className="absolute top-2 right-2"
            />
          )}

          {showDividers && index < items.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
          )}
        </motion.div>
      );
    };

    const renderGroup = (group: DescriptionListGroup, groupIndex: number) => {
      const isCollapsed = collapsedGroups.has(groupIndex);

      return (
        <div
          key={`group-${groupIndex}`}
          className={cn(
            'rounded-lg border border-border',
            'bg-background',
            'overflow-hidden'
          )}
        >
          {(group.title || group.collapsible) && (
            <div className="px-4 py-3 border-b border-border bg-background-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {group.icon && (
                    <span className="text-foreground-muted">
                      {group.icon}
                    </span>
                  )}
                  {group.title && (
                    <h3 className={cn(termVariants({ size, emphasis: 'strong' }))}>
                      {group.title}
                    </h3>
                  )}
                </div>

                {group.collapsible && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupIndex)}
                    className="p-1.5 rounded-md hover:bg-background-tertiary transition-colors"
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? '展开' : '折叠'}
                  >
                    <motion.div
                      animate={{ rotate: isCollapsed ? 0 : 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} className="text-foreground-muted" />
                    </motion.div>
                  </button>
                )}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={false}
                animate={{
                  height: 'auto',
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-2 md:p-3">
                  {group.items.map((item, itemIndex) => {
                    const globalIndex = groupIndex * 1000 + itemIndex;
                    const customItem = renderCustomItem?.(item, globalIndex);

                    if (customItem) {
                      return <React.Fragment key={globalIndex}>{customItem}</React.Fragment>;
                    }

                    return renderItem(item, globalIndex);
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    const renderDirectItems = () => {
      return (
        <div className={cn(descriptionListVariants({ variant, size, density }))}>
          {items.map((item, index) => {
            const customItem = renderCustomItem?.(item, index);

            if (customItem) {
              return <React.Fragment key={index}>{customItem}</React.Fragment>;
            }

            return renderItem(item, index);
          })}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className="w-full"
        role="list"
        aria-label={ariaLabel || (typeof label === 'string' ? label : '描述列表')}
      >
        {label && (
          <h2 className={cn(termVariants({ size: 'md', emphasis: 'strong' }), 'mb-4')}>
            {label}
          </h2>
        )}

        {groups && groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map((group, index) => renderGroup(group, index))}
          </div>
        ) : (
          renderDirectItems()
        )}
      </div>
    );
  }
);

DescriptionList.displayName = 'DescriptionList';

// ============================================================================
// 导出
// ============================================================================

export type { DescriptionListProps, DescriptionListItem, DescriptionListGroup };
export { Term, Description };
