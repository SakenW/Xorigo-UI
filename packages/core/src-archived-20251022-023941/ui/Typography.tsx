import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { semanticColors } from '@xorigo-ui/tokens'
import { cn } from '../utils/cn'

const typographyVariants = cva(
  "",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        h5: "scroll-m-20 text-lg font-semibold tracking-tight",
        h6: "scroll-m-20 text-base font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
        blockquote: "mt-6 border-l-2 pl-6 italic",
        ul: "my-6 ml-6 list-disc [&:not(:first-child)]:mt-6",
        ol: "my-6 ml-6 list-decimal [&:not(:first-child)]:mt-6",
        code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        lead: "text-xl text-muted-foreground",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
        "7xl": "text-7xl",
        "8xl": "text-8xl",
        "9xl": "text-9xl",
      },
      weight: {
        thin: "font-thin",
        extralight: "font-extralight",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        destructive: "text-destructive",
        success: "text-[var(--text-success)]",
        warning: "text-[var(--text-warning)]",
        error: "text-[var(--text-error)]",
        info: "text-[var(--text-info)]",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
      transform: {
        none: "",
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
      truncate: {
        true: "truncate",
        false: "",
      },
    },
    defaultVariants: {
      variant: "p",
      size: "base",
      weight: "normal",
      color: "default",
      align: "left",
      transform: "none",
      truncate: false,
    },
  }
)

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, size, weight, color, align, transform, truncate, as, children, ...props }, ref) => {
    const Component = as || ((variant?.startsWith('h') ? variant : 'p') as keyof JSX.IntrinsicElements)

    return (
      <Component
        className={cn(typographyVariants({ variant, size, weight, color, align, transform, truncate, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = "Typography"

export { Typography }

// 便捷组件
export const H1: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h1" as="h1" {...props} />
)

export const H2: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h2" as="h2" {...props} />
)

export const H3: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h3" as="h3" {...props} />
)

export const H4: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h4" as="h4" {...props} />
)

export const H5: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h5" as="h5" {...props} />
)

export const H6: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="h6" as="h6" {...props} />
)

export const P: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="p" as="p" {...props} />
)

export const Blockquote: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="blockquote" as="blockquote" {...props} />
)

export const TextCode: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="code" as="code" {...props} />
)

export const Lead: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="lead" {...props} />
)

export const Large: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="large" {...props} />
)

export const Small: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="small" {...props} />
)

export const Muted: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="muted" {...props} />
)