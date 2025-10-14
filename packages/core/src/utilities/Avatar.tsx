import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-medium text-gray-600",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
      variant: {
        default: "bg-gray-100",
        primary: "bg-blue-100 text-blue-600",
        secondary: "bg-gray-100 text-gray-600",
        success: "bg-green-100 text-green-600",
        warning: "bg-yellow-100 text-yellow-600",
        error: "bg-red-100 text-red-600",
        info: "bg-cyan-100 text-cyan-600",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

const avatarImageVariants = cva(
  "h-full w-full rounded-full object-cover",
  {
    variants: {
      status: {
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-300",
        away: "ring-2 ring-yellow-500",
        busy: "ring-2 ring-red-500",
      },
    },
  }
)

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-600",
        primary: "bg-blue-100 text-blue-600",
        secondary: "bg-gray-100 text-gray-600",
        success: "bg-green-100 text-green-600",
        warning: "bg-yellow-100 text-yellow-600",
        error: "bg-red-100 text-red-600",
        info: "bg-cyan-100 text-cyan-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const statusIndicatorVariants = cva(
  "absolute rounded-full border-2 border-white",
  {
    variants: {
      status: {
        online: "bg-green-500",
        offline: "bg-gray-300",
        away: "bg-yellow-500",
        busy: "bg-red-500",
      },
      size: {
        xs: "h-2 w-2 bottom-0 right-0",
        sm: "h-2.5 w-2.5 bottom-0 right-0",
        md: "h-3 w-3 bottom-0 right-0",
        lg: "h-3.5 w-3.5 bottom-0 right-0",
        xl: "h-4 w-4 bottom-0 right-0",
        "2xl": "h-5 w-5 bottom-0 right-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    size,
    variant,
    src,
    alt,
    fallback,
    status,
    showStatus = false,
    ...props
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const handleImageError = React.useCallback(() => {
      setImageError(true)
    }, [])

    const handleImageLoad = React.useCallback(() => {
      setImageLoaded(true)
    }, [])

    const getInitials = React.useCallback((name: string) => {
      if (!name) return ''
      const words = name.trim().split(' ')
      if (words.length >= 2) {
        return words[0][0] + words[words.length - 1][0]
      }
      return words[0].slice(0, 2).toUpperCase()
    }, [])

    const displayContent = React.useMemo(() => {
      if (src && !imageError) {
        return (
          <img
            className={cn(avatarImageVariants({ status: showStatus ? status : undefined }))}
            src={src}
            alt={alt || 'Avatar'}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )
      }

      if (fallback) {
        return (
          <div className={cn(avatarFallbackVariants({ variant }))}>
            {getInitials(fallback)}
          </div>
        )
      }

      return (
        <div className={cn(avatarFallbackVariants({ variant }))}>
          <svg
            className="h-1/2 w-1/2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )
    }, [src, imageError, fallback, variant, alt, handleImageError, handleImageLoad, getInitials, showStatus, status])

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, className }))}
        {...props}
      >
        {displayContent}
        {showStatus && status && (
          <div className={cn(statusIndicatorVariants({ status, size }))} />
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"

// Avatar with presence status
export const AvatarWithPresence = React.forwardRef<
  HTMLDivElement,
  AvatarProps & {
    presence?: 'online' | 'offline' | 'away' | 'busy'
    showPresence?: boolean
  }
>(({ presence, showPresence = true, ...props }, ref) => (
  <Avatar
    ref={ref}
    status={presence}
    showStatus={showPresence}
    {...props}
  />
))

AvatarWithPresence.displayName = "AvatarWithPresence"

export {
  Avatar,
  avatarVariants,
  avatarImageVariants,
  avatarFallbackVariants,
  statusIndicatorVariants,
}