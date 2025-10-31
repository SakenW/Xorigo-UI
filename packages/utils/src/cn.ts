/**
 * Classname utility function
 * Combines class names conditionally
 */

export type ClassNameValue = string | number | boolean | undefined | null | ClassNameValue[]

/**
 * Combines class names into a single string
 */
export function cn(...inputs: ClassNameValue[]): string {
  return inputs
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string' || typeof input === 'number') {
        return String(input)
      }
      if (Array.isArray(input)) {
        return cn(...input)
      }
      return ''
    })
    .join(' ')
    .trim()
}