/**
 * Xorigo UI Primitives - Atomic components layer
 *
 * This package contains the most basic, atomic UI components that cannot be
 * broken down further. These components are building blocks for all other
 * components in the design system.
 */

// Theme Switcher
export { ThemeSwitcher } from './theme-switcher';
export type { ThemeSwitcherProps } from './theme-switcher';

// Color Picker
export { ColorPicker } from './ColorPicker';
export type { ColorPickerProps } from './ColorPicker';

// Temporary Components (TODO: Move to proper structure)
export {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Input
} from './temp-components';
export type {
  ButtonProps,
  CardProps,
  BadgeProps,
  InputProps
} from './temp-components';