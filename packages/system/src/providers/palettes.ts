/**
 * 🎨 Color Director: 多样化配色方案
 *
 * 提供多种精心设计的配色方案，满足不同场景和偏好的需求
 * 每个配色方案都包含完整的主色、辅助色、渐变和特效配置
 */

// 🌟 配色方案类型定义
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
  gradient: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  glow: {
    primary: string;
    secondary: string;
    accent: string;
  };
  glass: {
    background: string;
    border: string;
    text: string;
  };
  shadows: {
    primary: string;
    secondary: string;
    accent: string;
  };
  tags: string[];
  mood: 'professional' | 'creative' | 'energetic' | 'calm' | 'playful' | 'elegant';
}

// 🎨 多样化配色方案集合
export const colorPalettes: ColorPalette[] = [
  // 1. 🌌 赛博蓝紫 (优化版)
  {
    id: 'cyber-blue-purple',
    name: '赛博蓝紫',
    description: '经典赛博朋克风格，蓝紫渐变充满科技感',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    accent: {
      50: '#fce7f3',
      100: '#fbcfe8',
      200: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
      secondary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      accent: 'linear-gradient(135deg, #ec4899 0%, #0ea5e9 100%)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    glow: {
      primary: 'rgba(14, 165, 233, 0.4)',
      secondary: 'rgba(168, 85, 247, 0.4)',
      accent: 'rgba(236, 72, 153, 0.4)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(14, 165, 233, 0.3)',
      secondary: '0 10px 25px -3px rgba(168, 85, 247, 0.3)',
      accent: '0 10px 25px -3px rgba(236, 72, 153, 0.3)'
    },
    tags: ['科技', '未来', '数字化', '专业'],
    mood: 'professional'
  },

  // 2. 🌅 温暖晨曦
  {
    id: 'warm-sunrise',
    name: '温暖晨曦',
    description: '温暖的橙色和黄色渐变，营造积极向上的氛围',
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    secondary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      secondary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      accent: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)'
    },
    glow: {
      primary: 'rgba(245, 158, 11, 0.4)',
      secondary: 'rgba(249, 115, 22, 0.4)',
      accent: 'rgba(239, 68, 68, 0.4)'
    },
    glass: {
      background: 'rgba(255, 248, 235, 0.1)',
      border: 'rgba(255, 248, 235, 0.2)',
      text: 'rgba(255, 248, 235, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(245, 158, 11, 0.3)',
      secondary: '0 10px 25px -3px rgba(249, 115, 22, 0.3)',
      accent: '0 10px 25px -3px rgba(239, 68, 68, 0.3)'
    },
    tags: ['温暖', '活力', '友好', '舒适'],
    mood: 'energetic'
  },

  // 3. 🌸 粉彩浪漫
  {
    id: 'pink-romance',
    name: '粉彩浪漫',
    description: '温柔的粉紫色系，营造浪漫优雅的氛围',
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    accent: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
      secondary: 'linear-gradient(135deg, #a855f7 0%, #f43f5e 100%)',
      accent: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)'
    },
    glow: {
      primary: 'rgba(236, 72, 153, 0.4)',
      secondary: 'rgba(168, 85, 247, 0.4)',
      accent: 'rgba(244, 63, 94, 0.4)'
    },
    glass: {
      background: 'rgba(253, 242, 248, 0.1)',
      border: 'rgba(253, 242, 248, 0.2)',
      text: 'rgba(253, 242, 248, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(236, 72, 153, 0.3)',
      secondary: '0 10px 25px -3px rgba(168, 85, 247, 0.3)',
      accent: '0 10px 25px -3px rgba(244, 63, 94, 0.3)'
    },
    tags: ['浪漫', '优雅', '温柔', '艺术'],
    mood: 'elegant'
  },

  // 4. 🌿 自然森林
  {
    id: 'forest-nature',
    name: '自然森林',
    description: '清新的绿色系，带来自然舒适的视觉体验',
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    },
    accent: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      secondary: 'linear-gradient(135deg, #10b981 0%, #84cc16 100%)',
      accent: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
    },
    glow: {
      primary: 'rgba(34, 197, 94, 0.4)',
      secondary: 'rgba(16, 185, 129, 0.4)',
      accent: 'rgba(132, 204, 22, 0.4)'
    },
    glass: {
      background: 'rgba(240, 253, 244, 0.1)',
      border: 'rgba(240, 253, 244, 0.2)',
      text: 'rgba(240, 253, 244, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(34, 197, 94, 0.3)',
      secondary: '0 10px 25px -3px rgba(16, 185, 129, 0.3)',
      accent: '0 10px 25px -3px rgba(132, 204, 22, 0.3)'
    },
    tags: ['自然', '清新', '环保', '健康'],
    mood: 'calm'
  },

  // 5. 🌊 深海秘境
  {
    id: 'deep-ocean',
    name: '深海秘境',
    description: '深邃的蓝色系，营造神秘专业的氛围',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    secondary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0c748d',
      800: '#125e73',
      900: '#164e63',
      950: '#083344'
    },
    accent: {
      50: '#e0f2fe',
      100: '#bae6fd',
      200: '#7dd3fc',
      300: '#38bdf8',
      400: '#0ea5e9',
      500: '#0284c7',
      600: '#0369a1',
      700: '#075985',
      800: '#0c4a6e',
      900: '#082f49',
      950: '#020617'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      secondary: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      accent: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    },
    glow: {
      primary: 'rgba(14, 165, 233, 0.4)',
      secondary: 'rgba(6, 182, 212, 0.4)',
      accent: 'rgba(2, 132, 199, 0.4)'
    },
    glass: {
      background: 'rgba(15, 23, 42, 0.1)',
      border: 'rgba(15, 23, 42, 0.2)',
      text: 'rgba(15, 23, 42, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(14, 165, 233, 0.3)',
      secondary: '0 10px 25px -3px rgba(6, 182, 212, 0.3)',
      accent: '0 10px 25px -3px rgba(2, 132, 199, 0.3)'
    },
    tags: ['深海', '神秘', '专业', '稳重'],
    mood: 'professional'
  },

  // 6. 🌹 高贵紫罗兰
  {
    id: 'royal-violet',
    name: '高贵紫罗兰',
    description: '优雅的紫罗兰色系，彰显高贵典雅的气质',
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065'
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e'
    },
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      secondary: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
      accent: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 100%)'
    },
    glow: {
      primary: 'rgba(139, 92, 246, 0.4)',
      secondary: 'rgba(217, 70, 239, 0.4)',
      accent: 'rgba(168, 85, 247, 0.4)'
    },
    glass: {
      background: 'rgba(245, 243, 255, 0.1)',
      border: 'rgba(245, 243, 255, 0.2)',
      text: 'rgba(245, 243, 255, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(139, 92, 246, 0.3)',
      secondary: '0 10px 25px -3px rgba(217, 70, 239, 0.3)',
      accent: '0 10px 25px -3px rgba(168, 85, 247, 0.3)'
    },
    tags: ['高贵', '优雅', '神秘', '奢华'],
    mood: 'elegant'
  },

  // 7. 🎯 极简黑白
  {
    id: 'minimal-black-white',
    name: '极简黑白',
    description: '经典的黑白配色，简约而富有力量感',
    primary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    secondary: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },
    accent: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
      secondary: 'linear-gradient(135deg, #111827 0%, #27272a 100%)',
      accent: 'linear-gradient(135deg, #27272a 0%, #374151 100%)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'
    },
    glow: {
      primary: 'rgba(55, 65, 81, 0.4)',
      secondary: 'rgba(17, 24, 39, 0.4)',
      accent: 'rgba(39, 39, 42, 0.4)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(55, 65, 81, 0.3)',
      secondary: '0 10px 25px -3px rgba(17, 24, 39, 0.3)',
      accent: '0 10px 25px -3px rgba(39, 39, 42, 0.3)'
    },
    tags: ['极简', '现代', '专业', '经典'],
    mood: 'professional'
  },

  // 8. 🍋 活力柠檬
  {
    id: 'vibrant-lemon',
    name: '活力柠檬',
    description: '明亮的柠檬黄绿配色，充满生机与活力',
    primary: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05'
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
      secondary: 'linear-gradient(135deg, #22c55e 0%, #f59e0b 100%)',
      accent: 'linear-gradient(135deg, #f59e0b 0%, #84cc16 100%)',
      background: 'linear-gradient(135deg, #f7fee7 0%, #f0fdf4 100%)'
    },
    glow: {
      primary: 'rgba(132, 204, 22, 0.4)',
      secondary: 'rgba(34, 197, 94, 0.4)',
      accent: 'rgba(245, 158, 11, 0.4)'
    },
    glass: {
      background: 'rgba(247, 254, 231, 0.1)',
      border: 'rgba(247, 254, 231, 0.2)',
      text: 'rgba(247, 254, 231, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(132, 204, 22, 0.3)',
      secondary: '0 10px 25px -3px rgba(34, 197, 94, 0.3)',
      accent: '0 10px 25px -3px rgba(245, 158, 11, 0.3)'
    },
    tags: ['活力', '清新', '年轻', '创意'],
    mood: 'playful'
  },

  // 9: 🎭 梦幻彩虹
  {
    id: 'dreamy-rainbow',
    name: '梦幻彩虹',
    description: '多彩的渐变配色，充满童趣和想象力',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    accent: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 25%, #0ea5e9 50%, #a855f7 75%, #ec4899 100%)',
      secondary: 'linear-gradient(135deg, #0ea5e9 0%, #ec4899 25%, #ef4444 50%, #f59e0b 75%, #f97316 100%)',
      accent: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f43f5e 50%, #0ea5e9 75%, #22c55e 100%)',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 25%, #f0f9ff 50%, #f7fee7 75%, #faf5ff 100%)'
    },
    glow: {
      primary: 'rgba(239, 68, 68, 0.4)',
      secondary: 'rgba(245, 158, 11, 0.4)',
      accent: 'rgba(14, 165, 233, 0.4)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      primary: '0 10px 25px -3px rgba(239, 68, 68, 0.3)',
      secondary: '0 10px 25px -3px rgba(245, 158, 11, 0.3)',
      accent: '0 10px 25px -3px rgba(14, 165, 233, 0.3)'
    },
    tags: ['彩虹', '童趣', '梦幻', '多彩'],
    mood: 'playful'
  },

  // 10. 🎪 狂欢节马戏团
  {
    id: 'carnival-circus',
    name: '嘉年华马戏团',
    description: '热情奔放的五彩配色，营造欢乐节庆氛围',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    accent: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05'
    },
    gradient: {
      primary: 'linear-gradient(45deg, #ef4444 0%, #f59e0b 20%, #84cc16 40%, #22c55e 60%, #3b82f6 80%, #a855f7 100%)',
      secondary: 'linear-gradient(45deg, #a855f7 0%, #ef4444 25%, #f59e0b 50%, #84cc16 75%, #22c55e 100%)',
      accent: 'linear-gradient(45deg, #22c55e 0%, #3b82f6 25%, #a855f7 50%, #ef4444 75%, #f59e0b 100%)',
      background: 'linear-gradient(45deg, #fef2f2 0%, #fffbeb 20%, #f7fee7 40%, #ecfdf5 60%, #e0f2fe 80%, #faf5ff 100%)'
    },
    glow: {
      primary: 'rgba(239, 68, 68, 0.5)',
      secondary: 'rgba(245, 158, 11, 0.5)',
      accent: 'rgba(132, 204, 22, 0.5)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.25)',
      text: 'rgba(255, 255, 255, 0.95)'
    },
    shadows: {
      primary: '0 15px 30px -5px rgba(239, 68, 68, 0.4)',
      secondary: '0 15px 30px -5px rgba(245, 158, 11, 0.4)',
      accent: '0 15px 30px -5px rgba(132, 204, 22, 0.4)'
    },
    tags: ['欢乐', '节庆', '热闹', '多彩'],
    mood: 'playful'
  }
];

// 🎨 配色方案工具函数
export const getPaletteById = (id: string): ColorPalette | undefined => {
  return colorPalettes.find(palette => palette.id === id);
};

export const getPalettesByMood = (mood: ColorPalette['mood']): ColorPalette[] => {
  return colorPalettes.filter(palette => palette.mood === mood);
};

export const getRandomPalette = (): ColorPalette => {
  const randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return colorPalettes[randomIndex] || colorPalettes[0]!;
};

export const searchPalettes = (query: string): ColorPalette[] => {
  const lowercaseQuery = query.toLowerCase();
  return colorPalettes.filter(palette =>
    palette.name.toLowerCase().includes(lowercaseQuery) ||
    palette.description.toLowerCase().includes(lowercaseQuery) ||
    palette.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// 🎨 配色方案推荐
export const getRecommendedPalettes = (context: 'business' | 'creative' | 'education' | 'entertainment' | 'healthcare' | 'technology'): ColorPalette[] => {
  const recommendations = {
    business: ['cyber-blue-purple', 'deep-ocean', 'minimal-black-white', 'royal-violet'],
    creative: ['dreamy-rainbow', 'pink-romance', 'carnival-circus', 'vibrant-lemon'],
    education: ['warm-sunrise', 'vibrant-lemon', 'forest-nature', 'pink-romance'],
    entertainment: ['carnival-circus', 'dreamy-rainbow', 'warm-sunrise', 'cyber-blue-purple'],
    healthcare: ['forest-nature', 'warm-sunrise', 'cyber-blue-purple', 'deep-ocean'],
    technology: ['cyber-blue-purple', 'deep-ocean', 'minimal-black-white', 'royal-violet']
  };

  return recommendations[context as keyof typeof recommendations]
    .map(id => getPaletteById(id))
    .filter(Boolean) as ColorPalette[];
};

export default colorPalettes;
