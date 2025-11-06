/**
 * Prop Extractor 测试用例
 */

import { describe, it, expect } from 'vitest'
import { PropExtractor } from '../src/prop-extractor.js'
import { ComponentProps, StyleAttributes, Language } from '../src/types.js'

describe('PropExtractor', () => {
  let extractor: PropExtractor

  beforeEach(() => {
    extractor = new PropExtractor({
      language: 'zh',
      enableCache: false
    })
  })

  describe('布尔属性提取', () => {
    it('应该提取禁用状态', async () => {
      const inputs = [
        '禁用按钮',
        '不可用的输入框',
        '灰色状态的组件',
        'disabled button',
        'non-clickable input'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.disabled).toBe(true)
      }
    })

    it('应该提取加载状态', async () => {
      const inputs = [
        '加载中的按钮',
        '等待状态的输入框',
        'loading button',
        'waiting state'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.loading).toBe(true)
      }
    })

    it('应该提取错误状态', async () => {
      const inputs = [
        '错误状态的输入框',
        '报错的按钮',
        'failed component',
        'error state'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.error).toBe(true)
      }
    })

    it('应该提取成功状态', async () => {
      const inputs = [
        '成功状态的组件',
        '完成的按钮',
        'success component',
        'completed button'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.success).toBe(true)
      }
    })

    it('应该提取必填属性', async () => {
      const inputs = [
        '必填的输入框',
        '必须填写的字段',
        'required field',
        'mandatory input'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.required).toBe(true)
      }
    })

    it('应该提取只读属性', async () => {
      const inputs = [
        '只读的输入框',
        '不可编辑的字段',
        'read-only input',
        'non-editable field'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.readOnly).toBe(true)
      }
    })

    it('应该提取多个布尔属性', async () => {
      const input = '创建一个禁用且加载中的按钮'
      const props = await extractor.extractProps(input, 'zh', [])

      expect(props.disabled).toBe(true)
      expect(props.loading).toBe(true)
    })
  })

  describe('尺寸属性提取', () => {
    it('应该提取超小尺寸', async () => {
      const inputs = [
        '超小按钮',
        '特别小的组件',
        'xs size',
        'extra small button'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.size).toBe('xs')
      }
    })

    it('应该提取小尺寸', async () => {
      const inputs = [
        '小按钮',
        'small button',
        'sm size'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.size).toBe('sm')
      }
    })

    it('应该提取中等尺寸', async () => {
      const inputs = [
        '中等按钮',
        '中号按钮',
        '正常大小',
        'medium button',
        'md size'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.size).toBe('md')
      }
    })

    it('应该提取大尺寸', async () => {
      const inputs = [
        '大按钮',
        'large button',
        'lg size'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.size).toBe('lg')
      }
    })

    it('应该提取超大尺寸', async () => {
      const inputs = [
        '超大按钮',
        '特别大的组件',
        'xl size',
        'extra large button'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.size).toBe('xl')
      }
    })

    it('应该根据像素值判断尺寸', async () => {
      const inputs = [
        '30px 的按钮',
        '40px 的输入框',
        '50px 的组件'
      ]

      for (const input of inputs) {
        const props = await extractor.extractProps(input, 'zh', [])
        expect(props.size).toBeDefined()
        expect(['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size as string)).toBe(true)
      }
    })
  })

  describe('变体属性提取', () => {
    it('应该提取主要变体', async () => {
      const inputs = [
        '主要按钮',
        '默认样式',
        'primary button',
        'default variant'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('primary')
      }
    })

    it('应该提取次要变体', async () => {
      const inputs = [
        '次要按钮',
        'secondary button'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('secondary')
      }
    })

    it('应该提取边框变体', async () => {
      const inputs = [
        '边框按钮',
        '描边样式',
        'outline button',
        'bordered variant'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('outline')
      }
    })

    it('应该提取透明变体', async () => {
      const inputs = [
        '透明按钮',
        '幽灵样式',
        'ghost button',
        'transparent variant'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('ghost')
      }
    })

    it('应该提取链接变体', async () => {
      const inputs = [
        '链接按钮',
        '文本样式',
        'link button',
        'text variant'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('link')
      }
    })

    it('应该提取实心变体', async () => {
      const inputs = [
        '实心按钮',
        '填充样式',
        'solid button',
        'filled variant'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.variant).toBe('solid')
      }
    })
  })

  describe('样式属性提取', () => {
    describe('主题提取', () => {
      it('应该提取浅色主题', async () => {
        const inputs = [
          '浅色主题',
          '明亮模式',
          'light theme',
          'bright mode'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('light')
        }
      })

      it('应该提取深色主题', async () => {
        const inputs = [
          '深色主题',
          '暗色模式',
          'dark theme',
          'black theme'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('dark')
        }
      })

      it('应该提取自动主题', async () => {
        const inputs = [
          '跟随系统',
          '自动模式',
          'auto mode',
          'system default'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('auto')
        }
      })

      it('应该提取怀旧主题', async () => {
        const inputs = [
          '怀旧主题',
          '复古风格',
          'sepia theme',
          'vintage style'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('sepia')
        }
      })

      it('应该提取森林主题', async () => {
        const inputs = [
          '森林主题',
          '绿色风格',
          'forest theme',
          'green style'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('forest')
        }
      })

      it('应该提取海洋主题', async () => {
        const inputs = [
          '海洋主题',
          '蓝色风格',
          'ocean theme',
          'blue style'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('ocean')
        }
      })

      it('应该提取日落主题', async () => {
        const inputs = [
          '日落主题',
          '橙色风格',
          'sunset theme',
          'orange style'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.theme).toBe('sunset')
        }
      })
    })

    describe('密度提取', () => {
      it('应该提取紧凑密度', async () => {
        const inputs = [
          '紧凑布局',
          '密集排列',
          'compact layout',
          'dense arrangement'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.density).toBe('compact')
        }
      })

      it('应该提取舒适密度', async () => {
        const inputs = [
          '舒适布局',
          '适中间距',
          'comfortable layout',
          'normal spacing'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.density).toBe('comfortable')
        }
      })

      it('应该提取宽松密度', async () => {
        const inputs = [
          '宽松布局',
          '宽裕间距',
          'spacious layout',
          'loose spacing'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.density).toBe('spacious')
        }
      })
    })

    describe('动画提取', () => {
      it('应该提取无动画', async () => {
        const inputs = [
          '无动画',
          '静止状态',
          'no animation',
          'static state'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.motion).toBe('none')
        }
      })

      it('应该提取细微动画', async () => {
        const inputs = [
          '细微动画',
          '轻微过渡',
          'subtle animation',
          'gentle transition'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.motion).toBe('subtle')
        }
      })

      it('应该提取适中动画', async () => {
        const inputs = [
          '适中动画',
          '流畅过渡',
          'moderate animation',
          'smooth transition'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.motion).toBe('moderate')
        }
      })

      it('应该提取动态动画', async () => {
        const inputs = [
          '动态动画',
          '活泼效果',
          'dynamic animation',
          'energetic effect'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.motion).toBe('dynamic')
        }
      })
    })

    describe('视觉效果提取', () => {
      it('应该提取圆角效果', async () => {
        const inputs = [
          '圆角按钮',
          '圆形组件',
          'rounded button',
          'circular component'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.rounded).toBe(true)
        }
      })

      it('应该根据像素值判断圆角大小', async () => {
        const inputs = [
          '4px 圆角',
          '8px 圆角',
          '12px 圆角',
          '16px 圆角'
        ]

        for (const input of inputs) {
          const styles = await extractor.extractStyles(input, 'zh', [])
          expect(styles.rounded).toBe(true)
          expect(styles.roundedSize).toBeDefined()
        }
      })

      it('应该提取阴影效果', async () => {
        const inputs = [
          '有阴影的按钮',
          '投影效果',
          'raised card',
          'drop shadow'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.shadow).toBe(true)
          expect(styles.shadowLevel).toBeDefined()
        }
      })

      it('应该提取边框效果', async () => {
        const inputs = [
          '有边框的按钮',
          '描边样式',
          'bordered button',
          'outlined component'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.border).toBe(true)
          expect(styles.borderStyle).toBe('solid')
        }
      })

      it('应该识别虚线边框', async () => {
        const inputs = [
          '虚线边框',
          'dashed border'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.border).toBe(true)
          expect(styles.borderStyle).toBe('dashed')
        }
      })

      it('应该识别点线边框', async () => {
        const inputs = [
          '点线边框',
          'dotted border'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.border).toBe(true)
          expect(styles.borderStyle).toBe('dotted')
        }
      })

      it('应该提取渐变效果', async () => {
        const inputs = [
          '渐变色按钮',
          '渐变背景',
          'gradient button',
          'gradient background'
        ]

        for (const input of inputs) {
          const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
          const styles = await extractor.extractStyles(input, lang, [])
          expect(styles.gradient).toBe(true)
        }
      })
    })
  })

  describe('复杂场景测试', () => {
    it('应该提取多个属性组合', async () => {
      const input = '创建一个主要的大按钮，深色主题，有阴影和圆角'
      const props = await extractor.extractProps(input, 'zh', [])
      const styles = await extractor.extractStyles(input, 'zh', [])

      expect(props.size).toBe('lg')
      expect(props.variant).toBe('primary')
      expect(styles.theme).toBe('dark')
      expect(styles.shadow).toBe(true)
      expect(styles.rounded).toBe(true)
    })

    it('应该处理矛盾的属性', async () => {
      const input = '创建一个禁用但激活的按钮'
      const props = await extractor.extractProps(input, 'zh', [])

      // 应该同时存在这两个属性
      expect(props.disabled).toBe(true)
      expect(props.active).toBe(true)
    })

    it('应该处理英文复杂描述', async () => {
      const input = 'Create a large primary button with dark theme, rounded corners and shadow'
      const props = await extractor.extractProps(input, 'en', [])
      const styles = await extractor.extractStyles(input, 'en', [])

      expect(props.size).toBe('lg')
      expect(props.variant).toBe('primary')
      expect(styles.theme).toBe('dark')
      expect(styles.rounded).toBe(true)
      expect(styles.shadow).toBe(true)
    })
  })

  describe('边界条件测试', () => {
    it('应该处理空字符串', async () => {
      const props = await extractor.extractProps('', 'zh', [])
      const styles = await extractor.extractStyles('', 'zh', [])

      expect(props).toEqual({})
      expect(styles).toEqual({})
    })

    it('应该处理特殊字符', async () => {
      const input = '创建 @#$% 按钮'
      const props = await extractor.extractProps(input, 'zh', [])
      const styles = await extractor.extractStyles(input, 'zh', [])

      // 不应该崩溃
      expect(props).toBeDefined()
      expect(styles).toBeDefined()
    })

    it('应该处理重复词汇', async () => {
      const input = '创建创建按钮按钮'
      const props = await extractor.extractProps(input, 'zh', [])

      expect(props.size).toBeDefined()
    })

    it('应该处理长文本', async () => {
      const longInput = '创建一个按钮 ' + '需要支持大尺寸'.repeat(100)
      const props = await extractor.extractProps(longInput, 'zh', [])

      expect(props.size).toBe('lg')
    })
  })

  describe('功能属性测试', () => {
    it('应该提取可排序属性', async () => {
      const inputs = [
        '可排序的表格',
        '支持排序的表',
        'sortable table',
        'table with sorting'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.sortable).toBe(true)
      }
    })

    it('应该提取可过滤属性', async () => {
      const inputs = [
        '可过滤的表格',
        '支持筛选的表',
        'filterable table',
        'table with filter'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.filterable).toBe(true)
      }
    })

    it('应该提取分页属性', async () => {
      const inputs = [
        '分页的表格',
        '支持翻页的表',
        'paginated table',
        'table with pagination'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.paginated).toBe(true)
      }
    })

    it('应该提取虚拟滚动属性', async () => {
      const inputs = [
        '虚拟滚动的表格',
        '大量数据的表',
        'virtual scroll table',
        'large data table'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.virtual).toBe(true)
      }
    })

    it('应该提取多选属性', async () => {
      const inputs = [
        '多选的列表',
        '支持多选的组件',
        'multiple selection',
        'multi-select list'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.multiple).toBe(true)
      }
    })

    it('应该提取可清除属性', async () => {
      const inputs = [
        '可清除的输入框',
        '带清除按钮的输入',
        'clearable input',
        'input with clear button'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.clearable).toBe(true)
      }
    })

    it('应该提取可搜索属性', async () => {
      const inputs = [
        '可搜索的列表',
        '支持搜索的组件',
        'searchable list',
        'component with search'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.searchable).toBe(true)
      }
    })

    it('应该提取可拖拽属性', async () => {
      const inputs = [
        '可拖拽的元素',
        '支持拖拽的组件',
        'draggable element',
        'component with drag'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.draggable).toBe(true)
      }
    })

    it('应该提取可调整大小属性', async () => {
      const inputs = [
        '可调整大小的面板',
        '支持调整大小的组件',
        'resizable panel',
        'component with resize'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const props = await extractor.extractProps(input, lang, [])
        expect(props.resizable).toBe(true)
      }
    })
  })

  describe('数值属性测试', () => {
    it('应该提取像素值', async () => {
      const inputs = [
        '20px 的按钮',
        '50px 的高度',
        '100px 的宽度',
        '200px spacing'
      ]

      for (const input of inputs) {
        const props = await extractor.extractProps(input, 'zh', [])
        // 应该能够解析数值
        expect(props).toBeDefined()
      }
    })

    it('应该提取百分比', async () => {
      const inputs = [
        '50% 的宽度',
        '100% 的高度',
        '50% width',
        '100% height'
      ]

      for (const input of inputs) {
        const props = await extractor.extractProps(input, 'zh', [])
        expect(props).toBeDefined()
      }
    })

    it('应该提取行数', async () => {
      const inputs = [
        '5行的表格',
        '10行的列表',
        '5 rows',
        '10 rows'
      ]

      for (const input of inputs) {
        const props = await extractor.extractProps(input, 'zh', [])
        expect(props).toBeDefined()
      }
    })
  })

  describe('错误处理测试', () => {
    it('应该处理无效输入', async () => {
      const input = '!@#$%^&*()'
      const props = await extractor.extractProps(input, 'zh', [])
      const styles = await extractor.extractStyles(input, 'zh', [])

      expect(props).toEqual({})
      expect(styles).toEqual({})
    })

    it('应该处理未知属性', async () => {
      const input = '创建具有神奇属性的按钮'
      const props = await extractor.extractProps(input, 'zh', [])

      // 应该忽略未知属性
      expect(Object.keys(props).length).toBeLessThanOrEqual(1)
    })
  })
})
