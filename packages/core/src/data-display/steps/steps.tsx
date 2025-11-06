'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from '../../utils/cva-standalone'

const stepsVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        horizontal: "flex-row w-full",
        vertical: "flex-col h-full",
      },
      size: {
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
      },
      progress: {
        none: "",
        percentage: "relative",
        bar: "relative",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
      progress: "none",
    },
  }
)

const stepVariants = cva(
  "flex items-center",
  {
    variants: {
      status: {
        pending: "cursor-pointer",
        inProgress: "cursor-pointer",
        completed: "cursor-pointer",
        error: "cursor-pointer",
        skipped: "cursor-pointer",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
      clickable: {
        true: "hover:opacity-80",
        false: "",
      },
    },
    defaultVariants: {
      status: "pending",
      orientation: "horizontal",
      clickable: false,
    },
  }
)

const stepIndicatorVariants = cva(
  "flex items-center justify-center rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
      },
      status: {
        pending: "border-2 border-gray-300 dark:border-gray-600 bg-transparent",
        inProgress: "border-2 border-blue-500 bg-blue-500 text-white",
        completed: "border-2 border-green-500 bg-green-500 text-white",
        error: "border-2 border-red-500 bg-red-500 text-white",
        skipped: "border-2 border-gray-400 bg-gray-400 text-white",
      },
      clickable: {
        true: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      status: "pending",
      clickable: false,
    },
  }
)

const stepConnectorVariants = cva(
  "bg-gray-300 dark:bg-gray-600 transition-all duration-200",
  {
    variants: {
      orientation: {
        horizontal: "h-0.5 flex-1 min-w-[2rem]",
        vertical: "w-0.5 flex-1 min-h-[2rem]",
      },
      status: {
        pending: "opacity-30",
        inProgress: "opacity-60",
        completed: "opacity-100",
        error: "opacity-100",
        skipped: "opacity-50",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      status: "pending",
    },
  }
)

const stepContentVariants = cva(
  "flex flex-col",
  {
    variants: {
      orientation: {
        horizontal: "items-center text-center",
        vertical: "items-start",
      },
      size: {
        sm: "gap-1",
        md: "gap-1.5",
        lg: "gap-2",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  }
)

const stepTitleVariants = cva(
  "font-medium transition-colors duration-200",
  {
    variants: {
      status: {
        pending: "text-gray-600 dark:text-gray-400",
        inProgress: "text-blue-600 dark:text-blue-400",
        completed: "text-green-600 dark:text-green-400",
        error: "text-red-600 dark:text-red-400",
        skipped: "text-gray-500 dark:text-gray-500",
      },
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "md",
    },
  }
)

const stepDescriptionVariants = cva(
  "text-gray-500 dark:text-gray-500",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface StepItem {
  id: string | number
  title: string
  description?: string
  icon?: React.ReactNode
  status?: 'pending' | 'inProgress' | 'completed' | 'error' | 'skipped'
  disabled?: boolean
  isClickable?: boolean
  onClick?: () => void
  isCollapsible?: boolean
  customContent?: React.ReactNode
}

export interface StepsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>,
    VariantProps<typeof stepsVariants> {
  items: StepItem[]
  currentStep?: number
  onStepClick?: (index: number, step: StepItem) => void
  allowClickNavigation?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean[]
  expanded?: boolean[]
  onExpandedChange?: (expanded: boolean[]) => void
  showProgressBar?: boolean
  progressPercentage?: number
  onProgressUpdate?: (percentage: number) => void
  responsive?: boolean
  testId?: string
}

interface StepsContextValue {
  items: StepItem[]
  orientation: 'horizontal' | 'vertical'
  size: 'sm' | 'md' | 'lg'
  currentStep: number
  onStepClick: (index: number, step: StepItem) => void
  allowClickNavigation: boolean
  expanded: boolean[]
  onToggleExpanded: (index: number) => void
  showProgressBar: boolean
  progressPercentage?: number
  clickable: boolean
}

const StepsContext = React.createContext<StepsContextValue | null>(null)

const useSteps = () => {
  const context = React.useContext(StepsContext)
  if (!context) {
    throw new Error('useSteps must be used within a Steps component')
  }
  return context
}

const Steps = React.forwardRef<HTMLElement, StepsProps>(
  ({
    className,
    items = [],
    orientation = 'horizontal',
    size = 'md',
    currentStep: currentStepProp,
    onStepClick,
    allowClickNavigation = false,
    collapsible = false,
    defaultExpanded = [],
    expanded: expandedProp,
    onExpandedChange,
    showProgressBar = false,
    progressPercentage,
    onProgressUpdate,
    responsive = true,
    testId,
    ...props
  }, ref) => {
    const [internalCurrentStep, setInternalCurrentStep] = useState(0)
    const currentStep = currentStepProp ?? internalCurrentStep
    const [internalExpanded, setInternalExpanded] = useState<boolean[]>(
      defaultExpanded.length > 0
        ? defaultExpanded
        : new Array(items.length).fill(false)
    )
    const isControlledExpanded = expandedProp !== undefined
    const expanded = isControlledExpanded ? expandedProp : internalExpanded
    const stepsContainerRef = useRef<HTMLDivElement>(null)

    // 计算进度百分比
    const calculatedProgress = progressPercentage ?? ((currentStep + 1) / items.length) * 100

    const handleStepClick = useCallback((index: number, step: StepItem) => {
      if (step.disabled) return

      if (allowClickNavigation || step.isClickable) {
        setInternalCurrentStep(index)
        onStepClick?.(index, step)
        onProgressUpdate?.(calculatedProgress)
      }
    }, [allowClickNavigation, onStepClick, onProgressUpdate, calculatedProgress])

    const handleToggleExpanded = useCallback((index: number) => {
      if (!collapsible || !items[index]?.isCollapsible) return

      const newExpanded = [...expanded]
      newExpanded[index] = !newExpanded[index]

      if (!isControlledExpanded) {
        setInternalExpanded(newExpanded)
      }
      onExpandedChange?.(newExpanded)
    }, [collapsible, expanded, isControlledExpanded, onExpandedChange, items])

    // 键盘导航支持
    useEffect(() => {
      const container = stepsContainerRef.current
      if (!container) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!allowClickNavigation) return

        const stepButtons = container.querySelectorAll('[data-step-button]')
        const currentIndex = currentStep

        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault()
            if (orientation === 'horizontal' && currentIndex < items.length - 1) {
              const nextIndex = currentIndex + 1
              if (!items[nextIndex]?.disabled) {
                handleStepClick(nextIndex, items[nextIndex])
                stepButtons[nextIndex]?.focus()
              }
            }
            break
          case 'ArrowLeft':
            e.preventDefault()
            if (orientation === 'horizontal' && currentIndex > 0) {
              const prevIndex = currentIndex - 1
              if (!items[prevIndex]?.disabled) {
                handleStepClick(prevIndex, items[prevIndex])
                stepButtons[prevIndex]?.focus()
              }
            }
            break
          case 'ArrowDown':
            e.preventDefault()
            if (orientation === 'vertical' && currentIndex < items.length - 1) {
              const nextIndex = currentIndex + 1
              if (!items[nextIndex]?.disabled) {
                handleStepClick(nextIndex, items[nextIndex])
                stepButtons[nextIndex]?.focus()
              }
            }
            break
          case 'ArrowUp':
            e.preventDefault()
            if (orientation === 'vertical' && currentIndex > 0) {
              const prevIndex = currentIndex - 1
              if (!items[prevIndex]?.disabled) {
                handleStepClick(prevIndex, items[prevIndex])
                stepButtons[prevIndex]?.focus()
              }
            }
            break
          case 'Home':
            e.preventDefault()
            if (items.length > 0 && !items[0]?.disabled) {
              handleStepClick(0, items[0])
              stepButtons[0]?.focus()
            }
            break
          case 'End':
            e.preventDefault()
            if (items.length > 0 && !items[items.length - 1]?.disabled) {
              const lastIndex = items.length - 1
              handleStepClick(lastIndex, items[lastIndex])
              stepButtons[lastIndex]?.focus()
            }
            break
        }
      }

      container.addEventListener('keydown', handleKeyDown)
      return () => {
        container.removeEventListener('keydown', handleKeyDown)
      }
    }, [items, currentStep, allowClickNavigation, orientation, handleStepClick])

    const contextValue: StepsContextValue = {
      items,
      orientation,
      size,
      currentStep,
      onStepClick: handleStepClick,
      allowClickNavigation,
      expanded,
      onToggleExpanded: handleToggleExpanded,
      showProgressBar,
      progressPercentage: calculatedProgress,
      clickable: allowClickNavigation,
    }

    const testIdAttr = testId || `steps-${orientation}-${size}`

    return (
      <StepsContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(stepsVariants({ orientation, size, className }))}
          aria-label="Steps"
          data-testid={testIdAttr}
          {...props}
        >
          <div
            ref={stepsContainerRef}
            className={cn(
              "flex w-full",
              orientation === 'horizontal' ? 'flex-row' : 'flex-col',
              responsive && orientation === 'horizontal' && "overflow-x-auto pb-4"
            )}
            role="list"
            aria-label="Step navigation"
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1
              const stepStatus = item.status || (index < currentStep ? 'completed' : index === currentStep ? 'inProgress' : 'pending')
              const isDisabled = item.disabled || false
              const canClick = (allowClickNavigation || item.isClickable) && !isDisabled

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex",
                    orientation === 'horizontal' ? 'items-center' : 'w-full',
                    !isLast && stepConnectorVariants({ orientation, status: stepStatus }),
                    "relative"
                  )}
                  role="listitem"
                >
                  <div
                    className={cn(
                      stepVariants({ status: stepStatus, orientation, clickable: canClick })
                    )}
                    onClick={() => canClick && handleStepClick(index, item)}
                  >
                    <StepIndicator
                      index={index}
                      step={item}
                      status={stepStatus}
                      isDisabled={isDisabled}
                    />
                    <StepContent
                      index={index}
                      step={item}
                      status={stepStatus}
                      isExpanded={expanded[index]}
                      onToggleExpanded={() => handleToggleExpanded(index)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {showProgressBar && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${calculatedProgress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(calculatedProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </nav>
      </StepsContext.Provider>
    )
  }
)

Steps.displayName = "Steps"

interface StepIndicatorProps {
  index: number
  step: StepItem
  status: 'pending' | 'inProgress' | 'completed' | 'error' | 'skipped'
  isDisabled: boolean
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  index,
  step,
  status,
  isDisabled,
}) => {
  const { size, allowClickNavigation, orientation, currentStep } = useSteps()
  const isActive = index === currentStep

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        orientation === 'horizontal' ? 'mr-2' : 'mb-2'
      )}
    >
      <div
        className={cn(stepIndicatorVariants({ size, status, clickable: allowClickNavigation }))}
        data-testid={`step-indicator-${index}-${status}`}
        aria-current={isActive ? 'step' : undefined}
        aria-disabled={isDisabled}
        tabIndex={allowClickNavigation && !isDisabled ? 0 : -1}
        data-step-button
        role="button"
      >
        {step.icon ? (
          <div className="flex items-center justify-center">
            {step.icon}
          </div>
        ) : status === 'completed' ? (
          <CheckIcon />
        ) : status === 'error' ? (
          <XIcon />
        ) : status === 'skipped' ? (
          <SkipIcon />
        ) : (
          <span className="font-medium">{index + 1}</span>
        )}
      </div>

      {orientation === 'horizontal' && !isLast && (
        <div
          className={cn(
            "mx-2",
            stepConnectorVariants({ orientation, status })
          )}
        />
      )}
    </div>
  )
}

const StepContent: React.FC<{
  index: number
  step: StepItem
  status: 'pending' | 'inProgress' | 'completed' | 'error' | 'skipped'
  isExpanded: boolean
  onToggleExpanded: () => void
}> = ({ index, step, status, isExpanded, onToggleExpanded }) => {
  const { size, orientation } = useSteps()
  const [isContentVisible, setIsContentVisible] = useState(false)

  useEffect(() => {
    if (step.isCollapsible) {
      setIsContentVisible(isExpanded)
    }
  }, [isExpanded, step.isCollapsible])

  if (orientation === 'horizontal' && !step.description && !step.customContent) {
    return null
  }

  return (
    <div
      className={cn(
        stepContentVariants({ orientation, size })
      )}
    >
      <div className="flex items-center gap-2">
        <h3
          className={cn(stepTitleVariants({ status, size }))}
          data-testid={`step-title-${index}-${status}`}
        >
          {step.title}
        </h3>

        {step.isCollapsible && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpanded()
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse step' : 'Expand step'}
          >
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
        )}
      </div>

      {step.description && orientation === 'vertical' && (
        <p
          className={cn(stepDescriptionVariants({ size }))}
          data-testid={`step-description-${index}-${status}`}
        >
          {step.description}
        </p>
      )}

      {step.customContent && (
        <div
          className={cn(
            "transition-all duration-200 overflow-hidden",
            step.isCollapsible ? (isContentVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0") : ""
          )}
          data-testid={`step-content-${index}-${status}`}
        >
          <div className="pt-2">
            {step.customContent}
          </div>
        </div>
      )}
    </div>
  )
}

// 图标组件
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-full h-full", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-full h-full", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const SkipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-full h-full", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 5l7 7-7 7M5 5h8v14H5V5z"
    />
  </svg>
)

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-full h-full", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

export { Steps, stepsVariants, stepVariants, stepIndicatorVariants, stepConnectorVariants, stepContentVariants, stepTitleVariants, stepDescriptionVariants }
export type { StepItem, StepsProps }
