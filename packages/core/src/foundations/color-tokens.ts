// 2025 Xorigo UI
export const colorTokens = {
  neutral: { 50:'#f8fafc', 900:'#0f172a' },
  accent:  { base:'#3b82f6', on:'#ffffff' }
} as const;
export type ColorTokens = typeof colorTokens;
