/**
 * 🎯 令牌访问器函数
 *
 * 提供对外部系统兼容的令牌访问函数
 */

import { colorTokens } from './colors'
import { themeRecipes } from './themes'
import buttonAliases from './aliases/components/button.json'
import cardAliases from './aliases/components/card.json'

/**
 * 获取核心令牌
 */
export function getCoreTokens() {
  return {
    palettes: colorTokens,
    foundations: {
      typography: {
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75',
        },
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  }
}

/**
 * 获取所有配方元数据
 */
export function getAllRecipeMeta() {
  return themeRecipes
}

/**
 * 获取所有密度预设
 */
export function getAllDensityPresets() {
  return {
    compact: {
      name: 'Compact',
      description: '紧凑型密度，适用于信息密集的界面',
      spacing: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      fontSize: {
        xs: '0.625rem',
        sm: '0.75rem',
        md: '0.875rem',
        lg: '1rem',
        xl: '1.125rem',
      },
    },
    comfortable: {
      name: 'Comfortable',
      description: '舒适型密度，默认推荐设置',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
    spacious: {
      name: 'Spacious',
      description: '宽松型密度，适用于呼吸感强的界面',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        md: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
      },
    },
  }
}