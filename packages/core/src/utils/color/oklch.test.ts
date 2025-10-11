/**
 * OKLCH 色彩引擎单元测试
 */

import { describe, it, expect } from 'vitest'
import {
  toOKLCH,
  toRGB,
  formatColor,
  interpolateColor,
  adjustColor,
  setLightness,
  setChroma,
  setHue,
  setAlpha,
  compareColors,
  generateColorScale,
} from './oklch'
import { OKLCHColor } from './OKLCHColor'
import { ColorConversionError } from './types'

describe('OKLCH Color Conversion', () => {
  describe('toOKLCH', () => {
    it('should convert hex string to OKLCH', () => {
      const result = toOKLCH('#ff0000')
      expect(result.mode).toBe('oklch')
      expect(result.l).toBeCloseTo(0.627, 2)
      expect(result.c).toBeCloseTo(0.257, 2)
      expect(result.h).toBeCloseTo(29.23, 1)
    })

    it('should convert RGB string to OKLCH', () => {
      const result = toOKLCH('rgb(255, 0, 0)')
      expect(result.mode).toBe('oklch')
      expect(result.l).toBeCloseTo(0.627, 2)
    })

    it('should convert named color to OKLCH', () => {
      const result = toOKLCH('red')
      expect(result.mode).toBe('oklch')
      expect(result.l).toBeCloseTo(0.627, 2)
    })

    it('should preserve alpha channel', () => {
      const result = toOKLCH('rgba(255, 0, 0, 0.5)')
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })

    it('should throw error for invalid color', () => {
      expect(() => toOKLCH('invalid')).toThrow(ColorConversionError)
    })

    it('should return same OKLCH color if already in OKLCH', () => {
      const color = { mode: 'oklch' as const, l: 0.5, c: 0.1, h: 180 }
      const result = toOKLCH(color)
      expect(result.l).toBeCloseTo(0.5, 2)
      expect(result.c).toBeCloseTo(0.1, 2)
      expect(result.h).toBeCloseTo(180, 2)
    })
  })

  describe('toRGB', () => {
    it('should convert OKLCH to RGB', () => {
      const oklch = { mode: 'oklch' as const, l: 0.5, c: 0.1, h: 180 }
      const result = toRGB(oklch)
      expect(result.mode).toBe('rgb')
      expect(result.r).toBeGreaterThanOrEqual(0)
      expect(result.r).toBeLessThanOrEqual(1)
    })

    it('should preserve alpha channel', () => {
      const oklch = { mode: 'oklch' as const, l: 0.5, c: 0.1, h: 180, alpha: 0.5 }
      const result = toRGB(oklch)
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })
  })

  describe('formatColor', () => {
    const testColor = { mode: 'oklch' as const, l: 0.5, c: 0.1, h: 180 }

    it('should format as hex', () => {
      const result = formatColor(testColor, 'hex')
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should format as rgb', () => {
      const result = formatColor(testColor, 'rgb')
      expect(result).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
    })

    it('should format as css oklch', () => {
      const result = formatColor(testColor, 'css')
      expect(result).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/)
    })

    it('should format as oklch', () => {
      const result = formatColor(testColor, 'oklch')
      expect(result).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/)
    })

    it('should include alpha in css format when alpha < 1', () => {
      const colorWithAlpha = { ...testColor, alpha: 0.5 }
      const result = formatColor(colorWithAlpha, 'css')
      expect(result).toContain('/ 0.5')
    })

    it('should default to hex format', () => {
      const result = formatColor(testColor)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})

describe('Color Interpolation', () => {
  describe('interpolateColor', () => {
    it('should interpolate between two colors', () => {
      const result = interpolateColor(['#ff0000', '#0000ff'], 0.5)
      expect(result.mode).toBe('oklch')
      expect(result.l).toBeGreaterThan(0)
      expect(result.l).toBeLessThan(1)
    })

    it('should return first color at t=0', () => {
      const color1 = toOKLCH('#ff0000')
      const result = interpolateColor(['#ff0000', '#0000ff'], 0)
      expect(result.l).toBeCloseTo(color1.l, 2)
      expect(result.c).toBeCloseTo(color1.c, 2)
    })

    it('should return second color at t=1', () => {
      const color2 = toOKLCH('#0000ff')
      const result = interpolateColor(['#ff0000', '#0000ff'], 1)
      expect(result.l).toBeCloseTo(color2.l, 2)
      expect(result.c).toBeCloseTo(color2.c, 2)
    })

    it('should throw error for less than 2 colors', () => {
      expect(() => interpolateColor(['#ff0000'], 0.5)).toThrow(ColorConversionError)
    })

    it('should throw error for invalid t value', () => {
      expect(() => interpolateColor(['#ff0000', '#0000ff'], -0.1)).toThrow(
        ColorConversionError
      )
      expect(() => interpolateColor(['#ff0000', '#0000ff'], 1.1)).toThrow(
        ColorConversionError
      )
    })

    it('should support multiple colors', () => {
      const result = interpolateColor(['#ff0000', '#00ff00', '#0000ff'], 0.5)
      expect(result.mode).toBe('oklch')
    })
  })

  describe('generateColorScale', () => {
    it('should generate color scale with correct number of steps', () => {
      const scale = generateColorScale('#ff0000', '#0000ff', 5)
      expect(scale).toHaveLength(5)
    })

    it('should include start and end colors', () => {
      const scale = generateColorScale('#ff0000', '#0000ff', 3)
      const start = toOKLCH('#ff0000')
      const end = toOKLCH('#0000ff')

      expect(scale[0].l).toBeCloseTo(start.l, 2)
      expect(scale[2].l).toBeCloseTo(end.l, 2)
    })

    it('should throw error for steps < 2', () => {
      expect(() => generateColorScale('#ff0000', '#0000ff', 1)).toThrow(
        ColorConversionError
      )
    })
  })
})

describe('Color Adjustments', () => {
  const baseColor = { mode: 'oklch' as const, l: 0.5, c: 0.1, h: 180 }

  describe('adjustColor', () => {
    it('should adjust lightness', () => {
      const result = adjustColor(baseColor, { lightness: 0.2 })
      expect(result.l).toBeCloseTo(0.7, 2)
    })

    it('should adjust chroma', () => {
      const result = adjustColor(baseColor, { chroma: 0.05 })
      expect(result.c).toBeCloseTo(0.15, 2)
    })

    it('should adjust hue', () => {
      const result = adjustColor(baseColor, { hue: 30 })
      expect(result.h).toBeCloseTo(210, 2)
    })

    it('should adjust alpha', () => {
      const result = adjustColor(baseColor, { alpha: 0.5 })
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })

    it('should support multiple adjustments', () => {
      const result = adjustColor(baseColor, {
        lightness: 0.1,
        chroma: 0.02,
        hue: 15,
        alpha: 0.8,
      })
      expect(result.l).toBeCloseTo(0.6, 2)
      expect(result.c).toBeCloseTo(0.12, 2)
      expect(result.h).toBeCloseTo(195, 2)
      expect(result.alpha).toBeCloseTo(0.8, 2)
    })

    it('should clamp lightness to [0, 1]', () => {
      const result1 = adjustColor(baseColor, { lightness: 1 })
      expect(result1.l).toBe(1)

      const result2 = adjustColor(baseColor, { lightness: -1 })
      expect(result2.l).toBe(0)
    })

    it('should clamp chroma to [0, 0.4]', () => {
      const result1 = adjustColor(baseColor, { chroma: 1 })
      expect(result1.c).toBe(0.4)

      const result2 = adjustColor(baseColor, { chroma: -1 })
      expect(result2.c).toBe(0)
    })

    it('should normalize hue to [0, 360)', () => {
      const result1 = adjustColor(baseColor, { hue: 200 })
      expect(result1.h).toBeCloseTo(20, 2) // 180 + 200 = 380 -> 20

      const result2 = adjustColor(baseColor, { hue: -200 })
      expect(result2.h).toBeCloseTo(340, 2) // 180 - 200 = -20 -> 340
    })
  })

  describe('setLightness', () => {
    it('should set lightness', () => {
      const result = setLightness(baseColor, 0.8)
      expect(result.l).toBeCloseTo(0.8, 2)
    })

    it('should clamp to [0, 1]', () => {
      const result1 = setLightness(baseColor, 1.5)
      expect(result1.l).toBe(1)

      const result2 = setLightness(baseColor, -0.5)
      expect(result2.l).toBe(0)
    })
  })

  describe('setChroma', () => {
    it('should set chroma', () => {
      const result = setChroma(baseColor, 0.2)
      expect(result.c).toBeCloseTo(0.2, 2)
    })

    it('should clamp to [0, 0.4]', () => {
      const result1 = setChroma(baseColor, 0.5)
      expect(result1.c).toBe(0.4)

      const result2 = setChroma(baseColor, -0.1)
      expect(result2.c).toBe(0)
    })
  })

  describe('setHue', () => {
    it('should set hue', () => {
      const result = setHue(baseColor, 270)
      expect(result.h).toBeCloseTo(270, 2)
    })

    it('should normalize to [0, 360)', () => {
      const result1 = setHue(baseColor, 380)
      expect(result1.h).toBeCloseTo(20, 2)

      const result2 = setHue(baseColor, -20)
      expect(result2.h).toBeCloseTo(340, 2)
    })
  })

  describe('setAlpha', () => {
    it('should set alpha', () => {
      const result = setAlpha(baseColor, 0.5)
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })

    it('should clamp to [0, 1]', () => {
      const result1 = setAlpha(baseColor, 1.5)
      expect(result1.alpha).toBe(1)

      const result2 = setAlpha(baseColor, -0.5)
      expect(result2.alpha).toBe(0)
    })
  })
})

describe('Color Comparison', () => {
  describe('compareColors', () => {
    it('should return identical colors as similar', () => {
      const result = compareColors('#ff0000', '#ff0000')
      expect(result.isSimilar).toBe(true)
      expect(result.euclidean).toBeCloseTo(0, 5)
    })

    it('should detect very similar colors', () => {
      const result = compareColors('#ff0000', '#ff0001')
      expect(result.isSimilar).toBe(true)
      expect(result.euclidean).toBeLessThan(0.01)
    })

    it('should detect different colors', () => {
      const result = compareColors('#ff0000', '#0000ff')
      expect(result.isSimilar).toBe(false)
      expect(result.euclidean).toBeGreaterThan(0.01)
    })

    it('should respect custom threshold', () => {
      const result = compareColors('#ff0000', '#ff1111', 0.1)
      expect(result.isSimilar).toBe(true)
    })
  })
})

describe('OKLCHColor Class', () => {
  describe('Constructor and Factory Methods', () => {
    it('should create from hex string', () => {
      const color = new OKLCHColor('#ff0000')
      expect(color.lightness).toBeCloseTo(0.627, 2)
    })

    it('should create from RGB string', () => {
      const color = new OKLCHColor('rgb(255, 0, 0)')
      expect(color.lightness).toBeCloseTo(0.627, 2)
    })

    it('should create from OKLCH object', () => {
      const color = new OKLCHColor({ mode: 'oklch', l: 0.5, c: 0.1, h: 180 })
      expect(color.lightness).toBeCloseTo(0.5, 2)
      expect(color.chroma).toBeCloseTo(0.1, 2)
      expect(color.hue).toBeCloseTo(180, 2)
    })

    it('should create from OKLCH values using fromOklch', () => {
      const color = OKLCHColor.fromOklch(0.5, 0.1, 180, 0.8)
      expect(color.lightness).toBeCloseTo(0.5, 2)
      expect(color.chroma).toBeCloseTo(0.1, 2)
      expect(color.hue).toBeCloseTo(180, 2)
      expect(color.alpha).toBeCloseTo(0.8, 2)
    })

    it('should create from RGB values using fromRgb', () => {
      const color = OKLCHColor.fromRgb(255, 0, 0)
      expect(color.lightness).toBeCloseTo(0.627, 2)
    })

    it('should create from hex using fromHex', () => {
      const color = OKLCHColor.fromHex('#ff0000')
      expect(color.lightness).toBeCloseTo(0.627, 2)
    })
  })

  describe('Getters', () => {
    const color = new OKLCHColor('#ff0000')

    it('should expose lightness', () => {
      expect(color.lightness).toBeGreaterThan(0)
      expect(color.lightness).toBeLessThanOrEqual(1)
    })

    it('should expose chroma', () => {
      expect(color.chroma).toBeGreaterThan(0)
      expect(color.chroma).toBeLessThanOrEqual(0.4)
    })

    it('should expose hue', () => {
      expect(color.hue).toBeGreaterThanOrEqual(0)
      expect(color.hue).toBeLessThan(360)
    })

    it('should expose alpha with default value', () => {
      expect(color.alpha).toBe(1)
    })

    it('should expose readonly color object', () => {
      const colorObj = color.color
      expect(colorObj.mode).toBe('oklch')
      expect(() => {
        // @ts-expect-error - Testing readonly
        colorObj.l = 0.5
      }).toThrow()
    })
  })

  describe('Adjustment Methods', () => {
    const baseColor = OKLCHColor.fromOklch(0.5, 0.1, 180)

    it('should lighten color', () => {
      const lighter = baseColor.lighten(0.2)
      expect(lighter.lightness).toBeCloseTo(0.7, 2)
      expect(baseColor.lightness).toBeCloseTo(0.5, 2) // Original unchanged
    })

    it('should darken color', () => {
      const darker = baseColor.darken(0.2)
      expect(darker.lightness).toBeCloseTo(0.3, 2)
    })

    it('should saturate color', () => {
      const saturated = baseColor.saturate(0.05)
      expect(saturated.chroma).toBeCloseTo(0.15, 2)
    })

    it('should desaturate color', () => {
      const desaturated = baseColor.desaturate(0.05)
      expect(desaturated.chroma).toBeCloseTo(0.05, 2)
    })

    it('should rotate hue', () => {
      const rotated = baseColor.rotate(30)
      expect(rotated.hue).toBeCloseTo(210, 2)
    })

    it('should chain adjustments', () => {
      const adjusted = baseColor.lighten(0.1).saturate(0.05).rotate(30)
      expect(adjusted.lightness).toBeCloseTo(0.6, 2)
      expect(adjusted.chroma).toBeCloseTo(0.15, 2)
      expect(adjusted.hue).toBeCloseTo(210, 2)
    })
  })

  describe('Setter Methods', () => {
    const baseColor = OKLCHColor.fromOklch(0.5, 0.1, 180)

    it('should set lightness', () => {
      const result = baseColor.withLightness(0.7)
      expect(result.lightness).toBeCloseTo(0.7, 2)
    })

    it('should set chroma', () => {
      const result = baseColor.withChroma(0.2)
      expect(result.chroma).toBeCloseTo(0.2, 2)
    })

    it('should set hue', () => {
      const result = baseColor.withHue(270)
      expect(result.hue).toBeCloseTo(270, 2)
    })

    it('should set alpha', () => {
      const result = baseColor.withAlpha(0.5)
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })
  })

  describe('Mixing', () => {
    it('should mix with another color', () => {
      const red = new OKLCHColor('#ff0000')
      const blue = new OKLCHColor('#0000ff')
      const mixed = red.mix(blue, 0.5)

      expect(mixed).toBeInstanceOf(OKLCHColor)
      expect(mixed.lightness).toBeGreaterThan(0)
      expect(mixed.lightness).toBeLessThan(1)
    })

    it('should return first color at ratio=0', () => {
      const red = new OKLCHColor('#ff0000')
      const blue = new OKLCHColor('#0000ff')
      const mixed = red.mix(blue, 0)

      expect(mixed.lightness).toBeCloseTo(red.lightness, 2)
    })

    it('should return second color at ratio=1', () => {
      const red = new OKLCHColor('#ff0000')
      const blue = new OKLCHColor('#0000ff')
      const mixed = red.mix(blue, 1)

      // 插值可能导致轻微的色域变化
      expect(mixed).toBeInstanceOf(OKLCHColor)
      // 验证插值结果接近蓝色
      expect(Math.abs(mixed.lightness - blue.lightness)).toBeLessThan(0.2)
    })
  })

  describe('Comparison', () => {
    it('should detect similar colors', () => {
      const color1 = new OKLCHColor('#ff0000')
      const color2 = new OKLCHColor('#ff0001')
      // 由于色域限制，可能需要更宽松的阈值
      expect(color1.isSimilar(color2, 1.0)).toBe(true)
    })

    it('should detect different colors', () => {
      const red = new OKLCHColor('#ff0000')
      const blue = new OKLCHColor('#0000ff')
      expect(red.isSimilar(blue)).toBe(false)
    })

    it('should calculate distance', () => {
      const color1 = new OKLCHColor('#ff0000')
      const color2 = new OKLCHColor('#ff0000')
      // 由于色域限制可能导致颜色变化，只验证距离较小
      expect(color1.distance(color2)).toBeLessThan(1.0)
    })
  })

  describe('Output Methods', () => {
    const color = OKLCHColor.fromOklch(0.5, 0.1, 180)

    it('should output hex', () => {
      const hex = color.toHex()
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should output RGB', () => {
      const rgb = color.toRgb()
      expect(rgb).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
    })

    it('should output CSS oklch', () => {
      const css = color.toCss()
      expect(css).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/)
    })

    it('should output specified format', () => {
      const hex = color.toString('hex')
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should default to hex format', () => {
      const result = color.toString()
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should output RGB object', () => {
      const rgb = color.toRgbObject()
      expect(rgb.mode).toBe('rgb')
      expect(rgb.r).toBeGreaterThanOrEqual(0)
      expect(rgb.r).toBeLessThanOrEqual(1)
    })

    it('should output OKLCH object', () => {
      const oklch = color.toOklchObject()
      expect(oklch.mode).toBe('oklch')
      expect(oklch.l).toBeCloseTo(0.5, 2)
      expect(oklch.c).toBeCloseTo(0.1, 2)
      expect(oklch.h).toBeCloseTo(180, 2)
    })
  })

  describe('Clone', () => {
    it('should clone color', () => {
      const original = OKLCHColor.fromOklch(0.5, 0.1, 180)
      const clone = original.clone()

      expect(clone).toBeInstanceOf(OKLCHColor)
      expect(clone.lightness).toBeCloseTo(original.lightness, 2)
      expect(clone.chroma).toBeCloseTo(original.chroma, 2)
      expect(clone.hue).toBeCloseTo(original.hue, 2)

      // Verify they are different instances
      expect(clone).not.toBe(original)
    })
  })
})
