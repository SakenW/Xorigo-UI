/**
 * Xorigo UI Overlays - Overlay components layer
 *
 * This package contains components that display content over other content.
 * These components are used for modals, dropdowns, tooltips and other
 * overlay interactions.
 */

// Re-export from core temporarily during migration
export * from '../../core/src/overlays';

// Overlay components
export { Dialog } from './dialog';
export { Sheet } from './sheet';
export { Popover } from './popover';
export { Drawer } from './drawer';

export type { DialogProps } from './dialog';
export type { SheetProps } from './sheet';
export type { PopoverProps } from './popover';
export type { DrawerProps } from './drawer';