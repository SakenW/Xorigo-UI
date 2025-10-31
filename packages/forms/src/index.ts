/**
 * Xorigo UI Forms - Form components layer
 *
 * This package contains components specifically designed for form building
 * and user input handling. These components build upon the primitives layer
 * to provide consistent form interactions.
 */

// Re-export from core temporarily during migration
export * from '../../core/src/form';

// Input components
export { Input } from './input';
export type { InputProps } from './input';