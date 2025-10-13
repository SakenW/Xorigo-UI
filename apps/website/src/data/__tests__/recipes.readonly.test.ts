/**
 * @fileoverview Recipes Readonly Adapter 单元测试
 */

import { describe, it, expect } from 'vitest'
import { readonlyRecipes } from '../recipes.readonly'

describe('RecipesReadonlyAdapter', () => {
  describe('getAllRecipes', () => {
    it('应该返回配方列表数组', () => {
      const recipes = readonlyRecipes.getAllRecipes()
      expect(Array.isArray(recipes)).toBe(true)
    })

    it('返回的配方应该有必需的属性', () => {
      const recipes = readonlyRecipes.getAllRecipes()
      if (recipes.length > 0) {
        const recipe = recipes[0]
        expect(recipe).toHaveProperty('id')
        expect(recipe).toHaveProperty('name')
        expect(recipe).toHaveProperty('axes')
        expect(recipe.axes).toHaveProperty('mode')
        expect(recipe.axes).toHaveProperty('tone')
        expect(recipe.axes).toHaveProperty('density')
      }
    })
  })

  describe('getRecipeById', () => {
    it('应该根据名称返回配方', () => {
      const recipes = readonlyRecipes.getAllRecipes()
      if (recipes.length > 0) {
        const firstRecipeName = recipes[0].name
        const recipe = readonlyRecipes.getRecipeById(firstRecipeName)
        expect(recipe).toBeDefined()
        expect(recipe?.name).toBe(firstRecipeName)
      }
    })

    it('不存在的配方应该返回 undefined', () => {
      const recipe = readonlyRecipes.getRecipeById('non-existent-recipe')
      expect(recipe).toBeUndefined()
    })
  })

  describe('getRecipesByAxis', () => {
    it('应该按模式筛选配方', () => {
      const modes = readonlyRecipes.getModes()
      if (modes.length > 0) {
        const mode = modes[0]
        const recipes = readonlyRecipes.getRecipesByAxis('mode', mode)
        expect(Array.isArray(recipes)).toBe(true)
        recipes.forEach((recipe) => {
          expect(recipe.axes.mode).toBe(mode)
        })
      }
    })

    it('应该按色调筛选配方', () => {
      const tones = readonlyRecipes.getTones()
      if (tones.length > 0) {
        const tone = tones[0]
        const recipes = readonlyRecipes.getRecipesByAxis('tone', tone)
        expect(Array.isArray(recipes)).toBe(true)
        recipes.forEach((recipe) => {
          expect(recipe.axes.tone).toBe(tone)
        })
      }
    })
  })

  describe('filterRecipes', () => {
    it('应该根据多个条件筛选配方', () => {
      const modes = readonlyRecipes.getModes()
      const tones = readonlyRecipes.getTones()

      if (modes.length > 0 && tones.length > 0) {
        const recipes = readonlyRecipes.filterRecipes({
          mode: modes[0],
          tone: tones[0],
        })

        expect(Array.isArray(recipes)).toBe(true)
        recipes.forEach((recipe) => {
          expect(recipe.axes.mode).toBe(modes[0])
          expect(recipe.axes.tone).toBe(tones[0])
        })
      }
    })

    it('应该返回所有配方当没有筛选条件时', () => {
      const allRecipes = readonlyRecipes.getAllRecipes()
      const filteredRecipes = readonlyRecipes.filterRecipes({})
      expect(filteredRecipes.length).toBe(allRecipes.length)
    })
  })

  describe('getStatistics', () => {
    it('应该返回配方统计信息', () => {
      const stats = readonlyRecipes.getStatistics()
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('byMode')
      expect(stats).toHaveProperty('byTone')
      expect(stats).toHaveProperty('byDensity')
      expect(typeof stats.total).toBe('number')
    })

    it('统计数字应该合理', () => {
      const stats = readonlyRecipes.getStatistics()
      const totalByMode = stats.byMode.light + stats.byMode.dark + stats.byMode.hc
      expect(totalByMode).toBeLessThanOrEqual(stats.total)
    })
  })

  describe('getModes', () => {
    it('应该返回所有模式', () => {
      const modes = readonlyRecipes.getModes()
      expect(Array.isArray(modes)).toBe(true)
      modes.forEach((mode) => {
        expect(['light', 'dark', 'hc']).toContain(mode)
      })
    })
  })

  describe('validateConsistency', () => {
    it('应该返回验证结果对象', () => {
      const result = readonlyRecipes.validateConsistency()
      expect(result).toHaveProperty('valid')
      expect(result).toHaveProperty('errors')
      expect(result).toHaveProperty('warnings')
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })
})
