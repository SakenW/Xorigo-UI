/**
 * 属性提取器 - 从用户描述中提取组件属性和样式信息
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  ComponentProps,
  ComponentSize,
  ComponentVariant,
  ComponentTheme,
  ComponentDensity,
  ComponentMotion,
  StyleAttributes,
  Entity,
  VALUE_ALIASES,
  Language,
  ParserConfig
} from './types.js'

/**
 * 属性提取器类
 */
export class PropExtractor {
  private claude: Anthropic | null = null
  private config: ParserConfig

  // 属性值模式映射
  private readonly SIZE_PATTERNS = {
    zh: {
      '超小': 'xs',
      '特别小': 'xs',
      '很小': 'sm',
      '小': 'sm',
      '中等': 'md',
      '中': 'md',
      '正常': 'md',
      '大': 'lg',
      '很大': 'lg',
      '超大': 'xl',
      '特别大': 'xl'
    },
    en: {
      'extra small': 'xs',
      'xs': 'xs',
      'very small': 'sm',
      'small': 'sm',
      'sm': 'sm',
      'medium': 'md',
      'md': 'md',
      'normal': 'md',
      'regular': 'md',
      'large': 'lg',
      'lg': 'lg',
      'very large': 'xl',
      'xl': 'xl',
      'extra large': 'xl',
      'huge': 'xl'
    }
  }

  private readonly VARIANT_PATTERNS = {
    zh: {
      '主要': 'primary',
      '默认': 'primary',
      '次要': 'secondary',
      '次级': 'secondary',
      '边框': 'outline',
      '描边': 'outline',
      '轮廓': 'outline',
      '透明': 'ghost',
      '幽灵': 'ghost',
      '链接': 'link',
      '文本': 'link',
      '实心': 'solid',
      '填充': 'solid',
      '简约': 'minimal',
      '极简': 'minimal'
    },
    en: {
      'primary': 'primary',
      'main': 'primary',
      'default': 'primary',
      'secondary': 'secondary',
      'outline': 'outline',
      'bordered': 'outline',
      'ghost': 'ghost',
      'transparent': 'ghost',
      'link': 'link',
      'text': 'link',
      'solid': 'solid',
      'filled': 'solid',
      'minimal': 'minimal',
      'simple': 'minimal'
    }
  }

  private readonly THEME_PATTERNS = {
    zh: {
      '浅色': 'light',
      '明亮': 'light',
      '光': 'light',
      '深色': 'dark',
      '暗色': 'dark',
      '黑': 'dark',
      '跟随系统': 'auto',
      '自动': 'auto',
      '系统': 'auto',
      '怀旧': 'sepia',
      '复古': 'sepia',
      '棕色': 'sepia',
      '森林': 'forest',
      '绿色': 'forest',
      '海洋': 'ocean',
      '蓝色': 'ocean',
      '日落': 'sunset',
      '橙色': 'sunset',
      '黄昏': 'sunset'
    },
    en: {
      'light': 'light',
      'bright': 'light',
      'light mode': 'light',
      'dark': 'dark',
      'dark mode': 'dark',
      'black': 'dark',
      'auto': 'auto',
      'automatic': 'auto',
      'system': 'auto',
      'follow system': 'auto',
      'sepia': 'sepia',
      'vintage': 'sepia',
      'retro': 'sepia',
      'forest': 'forest',
      'green': 'forest',
      'nature': 'forest',
      'ocean': 'ocean',
      'blue': 'ocean',
      'sea': 'ocean',
      'sunset': 'sunset',
      'orange': 'sunset',
      'dusk': 'sunset'
    }
  }

  private readonly DENSITY_PATTERNS = {
    zh: {
      '紧凑': 'compact',
      '紧密': 'compact',
      '密集': 'compact',
      '舒适': 'comfortable',
      '宽松': 'comfortable',
      '适中': 'comfortable',
      '宽裕': 'spacious',
      '宽松': 'spacious',
      '疏朗': 'spacious'
    },
    en: {
      'compact': 'compact',
      'tight': 'compact',
      'dense': 'compact',
      'comfortable': 'comfortable',
      'cozy': 'comfortable',
      'normal': 'comfortable',
      'spacious': 'spacious',
      'loose': 'spacious',
      'airy': 'spacious'
    }
  }

  constructor(config: ParserConfig) {
    this.config = config
    if (config.model) {
      this.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || ''
      })
    }
  }

  /**
   * 提取组件属性
   */
  async extractProps(input: string, language: Language, entities: Entity[]): Promise<ComponentProps> {
    const props: ComponentProps = {}

    // 提取布尔属性
    this.extractBooleanProps(input, language, props)

    // 提取枚举属性
    this.extractEnumProps(input, language, props)

    // 提取数值属性
    this.extractNumericProps(input, language, props)

    // 使用AI辅助提取
    if (this.claude && Object.keys(props).length === 0) {
      const aiProps = await this.extractPropsByAI(input, language)
      return { ...props, ...aiProps }
    }

    return props
  }

  /**
   * 提取样式属性
   */
  async extractStyles(input: string, language: Language, entities: Entity[]): Promise<StyleAttributes> {
    const styles: StyleAttributes = {}

    // 提取主题
    this.extractTheme(input, language, styles)

    // 提取密度
    this.extractDensity(input, language, styles)

    // 提取动画
    this.extractMotion(input, language, styles)

    // 提取视觉效果
    this.extractVisualEffects(input, language, styles)

    // 使用AI辅助提取
    if (this.claude && Object.keys(styles).length === 0) {
      const aiStyles = await this.extractStylesByAI(input, language)
      return { ...styles, ...aiStyles }
    }

    return styles
  }

  /**
   * 提取布尔属性
   */
  private extractBooleanProps(input: string, language: Language, props: ComponentProps): void {
    const patterns = {
      zh: {
        disabled: /(禁用|不可用|无法点击|灰色)/,
        loading: /(加载|loading|等待|载入)/,
        error: /(错误|报错|失败|红色)/,
        success: /(成功|完成|绿色)/,
        required: /(必填|必须|required|必选)/,
        readOnly: /(只读|不可编辑|禁止输入)/,
        selected: /(选中|选中状态|高亮)/,
        active: /(激活|当前|活跃)/,
        expandable: /(可展开|展开式|展开按钮)/,
        collapsible: /(可折叠|折叠式|折叠按钮)/,
        sortable: /(可排序|排序功能|点击排序)/,
        filterable: /(可过滤|筛选功能|过滤器)/,
        paginated: /(分页|页码|翻页)/,
        virtual: /(虚拟滚动|大量数据)/,
        async: /(异步|async|非同步)/,
        multiple: /(多选|复选|多个)/,
        clearable: /(可清除|清空|删除)/,
        searchable: /(可搜索|搜索框|查找)/,
        draggable: /(可拖拽|拖动|拖放)/,
        resizable: /(可调整大小|缩放|resize)/
      },
      en: {
        disabled: /(disabled|disabled state|grayed out|non-clickable)/,
        loading: /(loading|loading state|waiting|loading indicator)/,
        error: /(error|error state|failed|red)/,
        success: /(success|success state|completed|green)/,
        required: /(required|mandatory|must fill)/,
        readOnly: /(read-only|non-editable|cannot edit)/,
        selected: /(selected|selected state|highlighted)/,
        active: /(active|current|pressed)/,
        expandable: /(expandable|expand button|can expand)/,
        collapsible: /(collapsible|collapse button|can collapse)/,
        sortable: /(sortable|sort function|click to sort)/,
        filterable: /(filterable|filter function|has filter)/,
        paginated: /(paginated|pagination|page numbers)/,
        virtual: /(virtual scroll|large data)/,
        async: /(async|asynchronous|non-blocking)/,
        multiple: /(multiple|multi-select|multi)/,
        clearable: /(clearable|clear button|can clear)/,
        searchable: /(searchable|search box|can search)/,
        draggable: /(draggable|drag and drop|can drag)/,
        resizable: /(resizable|resize|can resize)/
      }
    }

    const langPatterns = patterns[language] || patterns.zh

    for (const [propName, pattern] of Object.entries(langPatterns)) {
      if (pattern.test(input)) {
        props[propName as keyof ComponentProps] = true
      }
    }

    // 特殊处理：禁用通常是false的默认值
    if (/(启用|enable|可点击|can click|可用)/i.test(input)) {
      props.disabled = false
    }
  }

  /**
   * 提取枚举属性
   */
  private extractEnumProps(input: string, language: Language, props: ComponentProps): void {
    // 提取尺寸
    const sizeValue = this.extractSize(input, language)
    if (sizeValue) {
      props.size = sizeValue
    }

    // 提取变体
    const variantValue = this.extractVariant(input, language)
    if (variantValue) {
      props.variant = variantValue
    }
  }

  /**
   * 提取数值属性
   */
  private extractNumericProps(input: string, language: Language, props: ComponentProps): void {
    const numericPatterns = {
      zh: /(\d+)\s*(px|像素|行|列|个|项|条|页)/g,
      en: /(\d+)\s*(px|pixels|rows|columns|items|entries|pages)/g
    }

    const pattern = numericPatterns[language] || numericPatterns.zh
    const matches = [...input.matchAll(pattern)]

    for (const match of matches) {
      const value = parseInt(match[1], 10)
      const unit = match[2].toLowerCase()

      if (unit.includes('px') || unit.includes('像素')) {
        // 可以设置最大高度、最小宽度等
        // 这里需要根据上下文决定具体属性
      } else if (unit.includes('行') || unit.includes('rows')) {
        // 可以设置表格行数
        // props.rows = value
      } else if (unit.includes('页') || unit.includes('pages')) {
        // 可以设置分页大小
        // props.pageSize = value
      }
    }
  }

  /**
   * 提取尺寸
   */
  private extractSize(input: string, language: Language): ComponentSize | null {
    const patterns = this.SIZE_PATTERNS[language] || this.SIZE_PATTERNS.zh

    for (const [pattern, size] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'gi')
      if (regex.test(input)) {
        return size as ComponentSize
      }
    }

    // 尝试提取数值
    const sizeValue = this.extractSizeValue(input, language)
    return sizeValue
  }

  /**
   * 提取尺寸数值
   */
  private extractSizeValue(input: string, language: Language): ComponentSize | null {
    const valueMap = {
      xs: [0, 24],
      sm: [25, 36],
      md: [37, 48],
      lg: [49, 64],
      xl: [65, Infinity]
    }

    const pxMatch = input.match(/(\d+)\s*px/i)
    if (pxMatch) {
      const px = parseInt(pxMatch[1], 10)
      for (const [size, [min, max]] of Object.entries(valueMap)) {
        if (px >= min && px <= max) {
          return size as ComponentSize
        }
      }
    }

    // 检查百分比
    if (/%/.test(input)) {
      const percentMatch = input.match(/(\d+)%/i)
      if (percentMatch) {
        const percent = parseInt(percentMatch[1], 10)
        if (percent <= 50) return 'sm'
        if (percent <= 75) return 'md'
        return 'lg'
      }
    }

    return null
  }

  /**
   * 提取变体
   */
  private extractVariant(input: string, language: Language): ComponentVariant | null {
    const patterns = this.VARIANT_PATTERNS[language] || this.VARIANT_PATTERNS.zh

    for (const [pattern, variant] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'gi')
      if (regex.test(input)) {
        return variant as ComponentVariant
      }
    }

    return null
  }

  /**
   * 提取主题
   */
  private extractTheme(input: string, language: Language, styles: StyleAttributes): void {
    const patterns = this.THEME_PATTERNS[language] || this.THEME_PATTERNS.zh

    for (const [pattern, theme] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'gi')
      if (regex.test(input)) {
        styles.theme = theme as ComponentTheme
        return
      }
    }

    // 检查是否有深色/浅色相关词汇
    if (/(深色主题|dark theme|暗色模式)/i.test(input)) {
      styles.theme = 'dark'
    } else if (/(浅色主题|light theme|明亮模式)/i.test(input)) {
      styles.theme = 'light'
    } else if (/(跟随系统|auto|system default)/i.test(input)) {
      styles.theme = 'auto'
    }
  }

  /**
   * 提取密度
   */
  private extractDensity(input: string, language: Language, styles: StyleAttributes): void {
    const patterns = this.DENSITY_PATTERNS[language] || this.DENSITY_PATTERNS.zh

    for (const [pattern, density] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'gi')
      if (regex.test(input)) {
        styles.density = density as ComponentDensity
        return
      }
    }
  }

  /**
   * 提取动画
   */
  private extractMotion(input: string, language: Language, styles: StyleAttributes): void {
    const motionPatterns = {
      zh: {
        '无动画': 'none',
        '静止': 'none',
        '细微': 'subtle',
        '轻微': 'subtle',
        '适中': 'moderate',
        '流畅': 'moderate',
        '动态': 'dynamic',
        '活泼': 'dynamic',
        '强烈': 'dynamic'
      },
      en: {
        'none': 'none',
        'no animation': 'none',
        'static': 'none',
        'subtle': 'subtle',
        'gentle': 'subtle',
        'moderate': 'moderate',
        'smooth': 'moderate',
        'dynamic': 'dynamic',
        'energetic': 'dynamic',
        'strong': 'dynamic'
      }
    }

    const patterns = motionPatterns[language] || motionPatterns.zh

    for (const [pattern, motion] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'gi')
      if (regex.test(input)) {
        styles.motion = motion as ComponentMotion
        return
      }
    }
  }

  /**
   * 提取视觉效果
   */
  private extractVisualEffects(input: string, language: Language, styles: StyleAttributes): void {
    // 圆角
    const roundedPatterns = {
      zh: /(圆角|圆形|圆滑|圆角\s*(\d+)\s*px|半圆|椭圆角)/gi,
      en: /(rounded|circular|smooth|round\s+(\d+)\s*px|semi-circle|oval)/gi
    }

    const roundedPattern = roundedPatterns[language] || roundedPatterns.zh
    if (roundedPattern.test(input)) {
      styles.rounded = true
      const pxMatch = input.match(/(\d+)\s*px/)
      if (pxMatch) {
        const px = parseInt(pxMatch[1], 10)
        if (px <= 4) styles.roundedSize = 'sm'
        else if (px <= 8) styles.roundedSize = 'md'
        else if (px <= 12) styles.roundedSize = 'lg'
        else styles.roundedSize = 'full'
      }
    }

    // 阴影
    const shadowPatterns = {
      zh: /(阴影|投影|elevation|浮起|立体)/gi,
      en: /(shadow|elevation|drop\s+shadow|raised|3d)/gi
    }

    const shadowPattern = shadowPatterns[language] || shadowPatterns.zh
    if (shadowPattern.test(input)) {
      styles.shadow = true
      if (/微\s*阴影|小\s*阴影|轻微\s*阴影|subtle\s*shadow/i.test(input)) {
        styles.shadowLevel = 'sm'
      } else if (/强\s*阴影|大\s*阴影|明显\s*阴影|strong\s*shadow/i.test(input)) {
        styles.shadowLevel = 'lg'
      } else {
        styles.shadowLevel = 'md'
      }
    }

    // 边框
    const borderPatterns = {
      zh: /(边框|描边|边框线|轮廓)/gi,
      en: /(border|outline|stroke|bordered)/gi
    }

    const borderPattern = borderPatterns[language] || borderPatterns.zh
    if (borderPattern.test(input)) {
      styles.border = true
      if (/虚线|dashed/i.test(input)) {
        styles.borderStyle = 'dashed'
      } else if (/点线|dotted/i.test(input)) {
        styles.borderStyle = 'dotted'
      } else {
        styles.borderStyle = 'solid'
      }
    }

    // 渐变
    const gradientPatterns = {
      zh: /(渐变|渐变色|过渡色)/gi,
      en: /(gradient|gradient\s+color|color\s+transition)/gi
    }

    const gradientPattern = gradientPatterns[language] || gradientPatterns.zh
    if (gradientPattern.test(input)) {
      styles.gradient = true
    }
  }

  /**
   * 使用AI提取属性
   */
  private async extractPropsByAI(input: string, language: Language): Promise<ComponentProps> {
    try {
      const prompt = this.buildPropExtractionPrompt(input, language)

      const response = await this.claude!.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 200,
        temperature: 0.1,
        system: 'You are a property extraction assistant. Extract component properties from user descriptions.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        return this.parsePropsResponse(content.text)
      }

      return {}
    } catch (error) {
      console.error('AI prop extraction error:', error)
      return {}
    }
  }

  /**
   * 使用AI提取样式
   */
  private async extractStylesByAI(input: string, language: Language): Promise<StyleAttributes> {
    try {
      const prompt = this.buildStyleExtractionPrompt(input, language)

      const response = await this.claude!.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 300,
        temperature: 0.1,
        system: 'You are a style extraction assistant. Extract style attributes from user descriptions.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        return this.parseStylesResponse(content.text)
      }

      return {}
    } catch (error) {
      console.error('AI style extraction error:', error)
      return {}
    }
  }

  /**
   * 构建属性提取提示词
   */
  private buildPropExtractionPrompt(input: string, language: Language): string {
    const promptZh = `
分析以下用户描述，提取组件属性。

用户描述：${input}

请根据以下属性列表判断是否适用：
- size: xs, sm, md, lg, xl
- variant: primary, secondary, outline, ghost, link, solid, minimal
- disabled: true/false
- loading: true/false
- error: true/false
- success: true/false
- required: true/false
- readOnly: true/false
- selected: true/false
- active: true/false
- expandable: true/false
- collapsible: true/false
- sortable: true/false
- filterable: true/false
- paginated: true/false
- virtual: true/false
- async: true/false
- multiple: true/false
- clearable: true/false
- searchable: true/false
- draggable: true/false
- resizable: true/false

请仅返回JSON格式的属性对象，不要其他内容。
`

    const promptEn = `
Analyze the user description and extract component properties.

User description: ${input}

Please determine if the following properties apply:
- size: xs, sm, md, lg, xl
- variant: primary, secondary, outline, ghost, link, solid, minimal
- disabled: true/false
- loading: true/false
- error: true/false
- success: true/false
- required: true/false
- readOnly: true/false
- selected: true/false
- active: true/false
- expandable: true/false
- collapsible: true/false
- sortable: true/false
- filterable: true/false
- paginated: true/false
- virtual: true/false
- async: true/false
- multiple: true/false
- clearable: true/false
- searchable: true/false
- draggable: true/false
- resizable: true/false

Please return only a JSON object of properties, nothing else.
`

    return language === 'zh' ? promptZh : promptEn
  }

  /**
   * 构建样式提取提示词
   */
  private buildStyleExtractionPrompt(input: string, language: Language): string {
    const promptZh = `
分析以下用户描述，提取样式属性。

用户描述：${input}

请根据以下样式属性列表判断：
- theme: light, dark, auto, sepia, forest, ocean, sunset
- density: compact, comfortable, spacious
- motion: none, subtle, moderate, dynamic
- rounded: true/false
- roundedSize: none, sm, md, lg, full
- shadow: true/false
- shadowLevel: none, sm, md, lg, xl
- border: true/false
- borderStyle: solid, dashed, dotted
- gradient: true/false

请仅返回JSON格式的样式对象，不要其他内容。
`

    const promptEn = `
Analyze the user description and extract style attributes.

User description: ${input}

Please determine the following style attributes:
- theme: light, dark, auto, sepia, forest, ocean, sunset
- density: compact, comfortable, spacious
- motion: none, subtle, moderate, dynamic
- rounded: true/false
- roundedSize: none, sm, md, lg, full
- shadow: true/false
- shadowLevel: none, sm, md, lg, xl
- border: true/false
- borderStyle: solid, dashed, dotted
- gradient: true/false

Please return only a JSON object of styles, nothing else.
`

    return language === 'zh' ? promptZh : promptEn
  }

  /**
   * 解析属性响应
   */
  private parsePropsResponse(text: string): ComponentProps {
    try {
      // 提取JSON部分
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Parse props response error:', error)
    }
    return {}
  }

  /**
   * 解析样式响应
   */
  private parseStylesResponse(text: string): StyleAttributes {
    try {
      // 提取JSON部分
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Parse styles response error:', error)
    }
    return {}
  }
}
