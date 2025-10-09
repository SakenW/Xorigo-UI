import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
