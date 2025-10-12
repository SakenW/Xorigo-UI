/**
 * 数据加载器
 * 从 @xorigo-ui/registry 和 @xorigo-ui/core 加载组件和配方数据
 */

import type { ComponentSearchData, RecipeSearchData } from './types'

// ============================================================================
// 组件数据加载
// ============================================================================

/**
 * 加载组件数据
 * 从 @xorigo-ui/registry 读取组件信息
 */
export async function loadComponents(): Promise<ComponentSearchData[]> {
  try {
    // 动态导入 registry
    const { generateRegistry } = await import('@xorigo-ui/registry')
    const registry = generateRegistry()

    if (!registry || !registry.components) {
      console.warn('[SearchAPI] Registry 数据为空')
      return []
    }

    // 转换为搜索数据格式
    return registry.components.map((component: any) => ({
      id: component.name.toLowerCase(),
      name: component.name,
      description: component.description,
      category: component.category,
      tags: component.variants?.map((v: any) => v.name) || [],
      path: `/components/${component.name.toLowerCase()}`,
    }))
  } catch (error) {
    console.error('[SearchAPI] 加载组件数据失败:', error)
    return []
  }
}

// ============================================================================
// 配方数据加载
// ============================================================================

/**
 * 加载配方数据
 * 从 @xorigo-ui/core 读取统一配方
 */
export async function loadRecipes(): Promise<RecipeSearchData[]> {
  try {
    // TODO: 配方系统已独立为 @xorigo-ui/style-recipe 包，需要重新实现配方数据加载
    console.warn('[SearchAPI] 配方数据加载暂未实现')
    return []
  } catch (error) {
    console.error('[SearchAPI] 加载配方数据失败:', error)
    return []
  }
}

// ============================================================================
// 数据预加载缓存
// ============================================================================

let componentsCache: ComponentSearchData[] | null = null
let recipesCache: RecipeSearchData[] | null = null

/**
 * 预加载所有数据
 */
export async function preloadData() {
  if (!componentsCache) {
    componentsCache = await loadComponents()
  }

  if (!recipesCache) {
    recipesCache = await loadRecipes()
  }

  return {
    components: componentsCache,
    recipes: recipesCache,
  }
}

/**
 * 获取缓存的组件数据
 */
export function getCachedComponents(): ComponentSearchData[] {
  return componentsCache || []
}

/**
 * 获取缓存的配方数据
 */
export function getCachedRecipes(): RecipeSearchData[] {
  return recipesCache || []
}
