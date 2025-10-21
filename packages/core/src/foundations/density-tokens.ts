// 2025 Xorigo UI
export const densityTokens = {
  spacious: { gap: 20, padding: 20 },
  comfortable: { gap: 12, padding: 12 },
  compact: { gap: 8, padding: 8 }
} as const;
export type DensityTokens = keyof typeof densityTokens;
