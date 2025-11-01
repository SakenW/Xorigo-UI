import React, { useState, useRef, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const navbarVariants = cva(
  "flex w-full items-center justify-between border-b bg-white px-4 py-2",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        dark: "border-gray-700 bg-gray-900 text-white",
        transparent: "border-transparent bg-transparent",
        sticky: "sticky top-0 z-50 border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
      },
      size: {
        sm: "h-12 px-3",
        md: "h-16 px-4",
        lg: "h-20 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const navbarSectionVariants = cva(
  "flex items-center gap-4",
  {
    variants: {
      position: {
        start: "",
        center: "flex-1 justify-center",
        end: "justify-end",
      },
    },
    defaultVariants: {
      position: "start",
    },
  }
)

const navbarBrandVariants = cva(
  "flex items-center gap-2 text-lg font-semibold",
  {
    variants: {
      variant: {
        default: "text-gray-900",
        dark: "text-white",
        transparent: "text-gray-900",
        sticky: "text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const navbarLinkVariants = cva(
  "text-sm font-medium transition-colors hover:text-blue-600",
  {
    variants: {
      variant: {
        default: "text-gray-600",
        dark: "text-gray-300 hover:text-white",
        transparent: "text-gray-600",
        sticky: "text-gray-600",
      },
      active: {
        true: "text-blue-600",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
)

const navbarToggleVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  {
    variants: {
      variant: {
        default: "",
        dark: "text-gray-300 hover:bg-gray-800 hover:text-white",
        transparent: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        sticky: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NavbarLink {
  label: string
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  brand?: string
  brandLogo?: React.ReactNode
  links?: NavbarLink[]
  actions?: React.ReactNode
  showMobileMenu?: boolean
  onMobileMenuToggle?: (open: boolean) => void
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({
    className,
    variant,
    size,
    brand,
    brandLogo,
    links = [],
    actions,
    showMobileMenu = false,
    onMobileMenuToggle,
    children,
    ...props
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    const handleMobileMenuToggle = React.useCallback(() => {
      const newState = !isMobileMenuOpen
      setIsMobileMenuOpen(newState)
      onMobileMenuToggle?.(newState)
    }, [isMobileMenuOpen, onMobileMenuToggle])

    // 点击外部关闭移动菜单
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
          setIsMobileMenuOpen(false)
          onMobileMenuToggle?.(false)
        }
      }

      if (isMobileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isMobileMenuOpen, onMobileMenuToggle])

    const renderNavLink = (link: NavbarLink, index: number) => {
      const LinkComponent = link.href ? 'a' : 'button'

      return (
        <LinkComponent
          key={index}
          type={link.href ? undefined : 'button'}
          href={link.href}
          onClick={link.onClick}
          className={cn(navbarLinkVariants({ variant, active: link.active }))}
        >
          {link.label}
        </LinkComponent>
      )
    }

    return (
      <header
        ref={ref}
        className={cn(navbarVariants({ variant, size, className }))}
        {...props}
      >
        {/* Brand Section */}
        <div className={cn(navbarSectionVariants({ position: 'start' }))}>
          {brandLogo && (
            <div className="flex-shrink-0">
              {brandLogo}
            </div>
          )}
          {brand && (
            <div className={cn(navbarBrandVariants({ variant }))}>
              {brand}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <nav className="flex items-center space-x-6">
            {links.map(renderNavLink)}
          </nav>
        </div>

        {/* Actions Section */}
        <div className={cn(navbarSectionVariants({ position: 'end' }))}>
          <div className="hidden md:flex items-center space-x-4">
            {actions}
          </div>

          {/* Mobile Menu Toggle */}
          {showMobileMenu && (
            <button
              type="button"
              className={cn(navbarToggleVariants({ variant }), "md:hidden")}
              onClick={handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && isMobileMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {links.map(renderNavLink)}
              {actions && (
                <div className="pt-4 border-t border-gray-200">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Children */}
        {children}
      </header>
    )
  }
)

Navbar.displayName = "Navbar"

export interface NavbarBrandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navbarBrandVariants> {}

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(navbarBrandVariants({ variant, className }))}
      {...props}
    />
  )
)

NavbarBrand.displayName = "NavbarBrand"

export interface NavbarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavbarNav = React.forwardRef<HTMLDivElement, NavbarNavProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("hidden md:flex md:flex-1 md:justify-center", className)}
      {...props}
    >
      {children}
    </nav>
  )
)

NavbarNav.displayName = "NavbarNav"

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("hidden md:flex items-center space-x-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)

NavbarActions.displayName = "NavbarActions"

export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarActions,
  navbarVariants,
  navbarBrandVariants,
  navbarLinkVariants,
  navbarToggleVariants,
}