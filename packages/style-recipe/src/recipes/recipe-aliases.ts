/**
 * 配方别名映射表
 * 将简写的配方名称映射到完整的配方ID
 */

import type { StyleRecipeID } from '../types'

/**
 * 配方别名映射
 */
export const RECIPE_ALIASES: Record<string, string> = {
  // 官方配方别名
  'corporate-blue': 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
  'corporate-navy-dark': 'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow',
  'minimal-white': 'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat',
  'minimal-graphite-dark': 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat',
  'tech-cyan': 'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow',
  'tech-neon-dark': 'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon',
  'creative-purple': 'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring',
  'creative-aurora-dark': 'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass',
  'classic-neutral': 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
  'high-contrast-pro': 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat',

  // 备份主题别名
  'warm-sunrise': 'light.neutral-warm-mid.analog(orange).standard.comfortable.standard.soft-shadow',
  'pink-romance': 'light.neutral-true-mid.analog(pink).vivid.spacious.subtle.flat',
  'forest-nature': 'light.neutral-cool-mid.analog(green).calm.comfortable.standard.flat',
  'deep-ocean': 'dark.neutral-true-high.analog(blue).calm.spacious.subtle.soft-shadow',
  'royal-violet': 'light.neutral-true-mid.analog(purple).standard.comfortable.standard.glass',
  'vibrant-lemon': 'light.neutral-warm-mid.mono(yellow).vivid.spacious.expressive.flat',
  'dreamy-rainbow': 'light.neutral-true-mid.duo(pink,purple).vivid.comfortable.standard.glass+neon',
  'carnival-circus': 'light.neutral-warm-mid.duo(red,orange).vivid.compact.expressive.soft-shadow',
}

/**
 * 获取真实的配方ID
 * @param alias 配方别名或完整ID
 * @returns 完整的配方ID
 */
export function getRealRecipeId(alias: string): string {
  return RECIPE_ALIASES[alias] || alias
}

/**
 * 检查是否为配方别名
 * @param id 配方ID或别名
 * @returns 是否为别名
 */
export function isRecipeAlias(id: string): boolean {
  return id in RECIPE_ALIASES
}

/**
 * 获取所有可用的别名
 * @returns 别名列表
 */
export function getAllAliases(): string[] {
  return Object.keys(RECIPE_ALIASES)
}