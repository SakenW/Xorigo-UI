import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './demo/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  // 确保动态生成的类名也被包含 - 用于cva动态类名
  safelist: [
    // 基础颜色类
    { pattern: /bg-(gray|blue|green|red|yellow|purple|pink|amber|emerald|cyan|orange)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /text-(gray|blue|green|red|yellow|purple|pink|amber|emerald|cyan|orange)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /border-(gray|blue|green|red|yellow|purple|pink|amber|emerald|cyan|orange)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    // 渐变相关
    { pattern: /from-(gray|blue|green|red|yellow|purple|pink|amber|emerald|cyan|orange)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /to-(gray|blue|green|red|yellow|purple|pink|amber|emerald|cyan|orange)-(50|100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /from-(primary|secondary)/ },
    { pattern: /to-(primary|secondary)/ },
    { pattern: /bg-gradient-to-(r|l|t|b|tr|tl|br|bl)/ },
  ],
  theme: {
    extend: {
      colors: {
        // 由设计令牌系统提供
        // 这里只定义Tailwind的基础配置
      },
      spacing: {
        // 4px网格系统
        // 由设计令牌系统提供
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // 由设计令牌系统提供
      },
      boxShadow: {
        // 由设计令牌系统提供
      },
      animation: {
        // Framer Motion处理大部分动画
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        // 自定义关键帧动画
      },
    },
  },
  plugins: [],
} satisfies Config
