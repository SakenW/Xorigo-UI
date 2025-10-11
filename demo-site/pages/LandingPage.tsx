import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "../../src/components/ui/Button"
import { Card } from "../../src/components/ui/Card"
import { Badge } from "../../src/components/ui/Badge"
import { Input } from "../../src/components/ui/Input"
import { Switch } from "../../src/components/ui/Switch"
import { useTheme } from "../../src/theme/ThemeProvider"
import {
  Sparkles, Zap, Palette, Code2, Box, Layers,
  Github, Book, ArrowRight, Star, Heart, Check,
  Moon, Monitor, Smartphone, Cpu, Eye
} from "lucide-react"

// 动画变体
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

const slideInFromLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const slideInFromRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// 浮动动画背景元素
const FloatingOrb = ({ delay = 0, duration = 20, size = "large" }: { delay?: number, duration?: number, size?: "small" | "medium" | "large" }) => {
  const sizes = {
    small: "w-32 h-32",
    medium: "w-64 h-64",
    large: "w-96 h-96"
  }

  return (
    <motion.div
      className={`${sizes[size]} absolute rounded-full blur-3xl opacity-30`}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -50, 100, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      style={{
        background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)"
      }}
    />
  )
}

// 主题切换预览卡片
const ThemePreviewCard = () => {
  const { currentTheme, setTheme, themeConfig } = useTheme()
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const themeColors = [
    { name: "赛博蓝紫", id: "cyber-blue-purple", color: "#3b82f6" },
    { name: "温暖晨曦", id: "warm-sunrise", color: "#f59e0b" },
    { name: "粉彩浪漫", id: "pink-romance", color: "#ec4899" },
    { name: "自然森林", id: "forest-nature", color: "#22c55e" },
    { name: "深海秘境", id: "deep-ocean", color: "#0ea5e9" },
    { name: "高贵紫罗兰", id: "royal-violet", color: "#8b5cf6" },
  ]

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">实时主题切换</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        点击任意颜色即可切换主题，体验流畅的过渡动画
      </p>
      <div className="grid grid-cols-3 gap-3">
        {themeColors.map((theme) => (
          <motion.button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            onHoverStart={() => setHoveredTheme(theme.id)}
            onHoverEnd={() => setHoveredTheme(null)}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-xl transition-all ${
              currentTheme === theme.id
                ? 'ring-2 ring-offset-2 ring-purple-600'
                : 'hover:shadow-lg'
            }`}
            style={{ backgroundColor: theme.color }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={false}
              animate={{
                boxShadow: hoveredTheme === theme.id
                  ? `0 0 30px ${theme.color}80`
                  : `0 0 0px ${theme.color}00`
              }}
            />
            <div className="relative">
              <div className="text-white text-xs font-medium text-center">
                {theme.name}
              </div>
              {currentTheme === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Check className="w-4 h-4 text-white bg-green-500 rounded-full p-0.5" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          当前主题: <span className="font-semibold text-purple-600">{themeConfig.name}</span>
        </div>
      </div>
    </Card>
  )
}

// 交互式组件演示
const InteractiveDemo = () => {
  const [inputValue, setInputValue] = useState("")
  const [switchOn, setSwitchOn] = useState(false)

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
      <div className="flex items-center gap-2 mb-4">
        <Box className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">交互式组件</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            输入框组件
          </label>
          <Input
            placeholder="尝试输入文字..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full"
          />
          <AnimatePresence>
            {inputValue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <Badge variant="success" className="text-xs">
                  输入了 {inputValue.length} 个字符
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            开关组件
          </span>
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
        </div>

        <AnimatePresence>
          {switchOn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-4 rounded-lg bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
            >
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">功能已启用！</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="primary" size="sm">主要</Button>
          <Button variant="secondary" size="sm">次要</Button>
          <Button variant="outline" size="sm">轮廓</Button>
        </div>
      </div>
    </Card>
  )
}

// 代码示例展示
const CodeExample = () => {
  const [copied, setCopied] = useState(false)

  const codeSnippet = `import { Button, Card } from '@th-ui/core'
import '@th-ui/core/dist/th-ui.css'

function App() {
  return (
    <Card>
      <h1>Hello TH-UI</h1>
      <Button variant="primary">
        点击我
      </Button>
    </Card>
  )
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-6 backdrop-blur-xl bg-gray-900/95">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">快速开始</h3>
        </div>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          {copied ? "已复制!" : "复制代码"}
        </motion.button>
      </div>
      <pre className="text-sm text-gray-300 overflow-x-auto">
        <code>{codeSnippet}</code>
      </pre>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          安装: <code className="text-green-400">npm install @th-ui/core</code>
        </div>
      </div>
    </Card>
  )
}

export default function LandingPage() {
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95])

  const features = [
    {
      icon: Zap,
      title: "极致性能",
      description: "基于 React 19 并发特性，支持服务端渲染和增量静态生成",
      color: "from-yellow-500 to-orange-500",
      stats: "99+ 性能分数"
    },
    {
      icon: Palette,
      title: "10种精美主题",
      description: "从赛博蓝紫到梦幻彩虹，每种主题都精心设计，支持明暗模式切换。完整的设计令牌体系，一键切换整体风格",
      color: "from-purple-500 to-pink-500",
      stats: "10 种配色方案"
    },
    {
      icon: Code2,
      title: "TypeScript 优先",
      description: "100% TypeScript 编写，提供完整的类型定义和智能提示。CVA 强类型变体系统，开发体验极佳",
      color: "from-blue-500 to-cyan-500",
      stats: "100% 类型安全"
    },
    {
      icon: Layers,
      title: "组件丰富",
      description: "34个精心设计的组件，基于 Radix UI 无障碍基础。覆盖表单、反馈、数据、导航、布局等所有场景",
      color: "from-green-500 to-emerald-500",
      stats: "34 个组件"
    },
    {
      icon: Sparkles,
      title: "流畅动画",
      description: "Framer Motion 12 驱动的微交互和页面过渡动画，60fps 丝滑体验。声明式 API，性能优化开箱即用",
      color: "from-indigo-500 to-purple-500",
      stats: "60fps 动画"
    },
    {
      icon: Eye,
      title: "无障碍设计",
      description: "基于 Radix UI Primitives 构建，遵循 WCAG 2.1 标准，支持键盘导航和屏幕阅读器，确保所有用户可访问",
      color: "from-rose-500 to-pink-500",
      stats: "WCAG 2.1"
    }
  ]

  const stats = [
    { label: "组件数量", value: "34", icon: Box },
    { label: "主题配色", value: "10", icon: Palette },
    { label: "TypeScript", value: "100%", icon: Code2 },
    { label: "测试覆盖", value: "95%", icon: Check }
  ]

  const techStack = [
    { name: "React", version: "19.2", icon: "⚛️", category: "framework" },
    { name: "TypeScript", version: "5.9", icon: "📘", category: "language" },
    { name: "Tailwind CSS", version: "4.1", icon: "🎨", category: "styling" },
    { name: "Framer Motion", version: "12", icon: "🎭", category: "animation" },
    { name: "Radix UI", version: "latest", icon: "🧩", category: "primitive" },
    { name: "CVA", version: "0.7", icon: "🎯", category: "utility" },
    { name: "Vite", version: "5.4", icon: "⚡", category: "build" },
    { name: "Vitest", version: "1.6", icon: "🧪", category: "testing" }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={20} size="large" />
        <FloatingOrb delay={5} duration={25} size="medium" />
        <FloatingOrb delay={10} duration={30} size="small" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* Logo Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <Badge className="px-6 py-2 text-sm backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border-2">
                <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
                v0.1.0 现已发布
              </Badge>
            </motion.div>

            {/* 主标题 */}
            <motion.h1
              variants={fadeInUp}
              className="text-7xl md:text-8xl font-black mb-6 leading-tight"
            >
              <span
                className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent inline-block"
              >
                TH-UI
              </span>
            </motion.h1>

            {/* 副标题 */}
            <motion.p
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4"
            >
              现代化 React 组件库
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              基于 <span className="font-semibold text-blue-600">React 19</span> +
              <span className="font-semibold text-blue-700"> TypeScript 5.9</span> +
              <span className="font-semibold text-cyan-600"> Tailwind CSS 4</span> +
              <span className="font-semibold text-purple-600"> Framer Motion 12</span>
              <br />
              提供 <span className="font-semibold">34 个精美组件</span>、
              <span className="font-semibold">10 种主题配色</span> 和
              <span className="font-semibold">流畅动画系统</span>
            </motion.p>

            {/* CTA 按钮组 */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 justify-center mb-16"
            >
              <Link to="/components">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="group relative min-w-[180px] h-12 text-base font-semibold shadow-xl hover:shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      查看组件库
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/style-recipe">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="group relative min-w-[180px] h-12 text-base font-semibold shadow-lg hover:shadow-xl overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      风格配方
                      <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="group relative min-w-[180px] h-12 text-base font-semibold hover:shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      查看源码
                    </span>
                  </Button>
                </motion.div>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    className="group relative min-w-[180px] h-12 text-base font-semibold hover:shadow-md overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Book className="w-4 h-4 mr-2" />
                      文档
                    </span>
                  </Button>
                </motion.div>
              </a>
            </motion.div>

            {/* 技术栈标签 */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 justify-center"
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-sm font-medium">{tech.name}</span>
                  <Badge variant="primary" className="text-xs">{tech.version}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* 向下滚动提示 */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative group"
              >
                <Card className="p-6 text-center backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2 hover:border-purple-500 transition-colors">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <div
                    className="text-4xl md:text-5xl font-black mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      boxShadow: "0 0 40px var(--color-primary)"
                    }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="px-4 py-2 text-sm mb-4 backdrop-blur-xl bg-purple-500/20">
                <Heart className="w-4 h-4 inline mr-2 text-pink-500" />
                核心特性
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              为什么选择 TH-UI？
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              现代化的设计理念，完善的开发体验，让你专注于业务逻辑
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="p-8 h-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2 hover:border-purple-500 transition-all group relative overflow-hidden">
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} p-3 mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    <Badge variant="primary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative z-10 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="px-4 py-2 text-sm mb-4 backdrop-blur-xl bg-blue-500/20">
                <Code2 className="w-4 h-4 inline mr-2 text-blue-500" />
                技术栈
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              基于现代化技术栈构建
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              采用业界最新的前端技术，确保组件库的性能、可维护性和开发体验
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group"
              >
                <Card className="p-6 text-center backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2 hover:border-blue-500 transition-all relative overflow-hidden">
                  {/* 背景发光效果 */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)"
                    }}
                  />

                  <div className="relative">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                      {tech.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      v{tech.version}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {tech.category}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* 技术栈说明 */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mt-16 max-w-4xl mx-auto"
          >
            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                🎯 技术栈优势
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">React 19 + TypeScript 5.9</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">最新技术栈，完整类型支持</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Tailwind CSS 4.1</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">原子化 CSS，按需加载</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Radix UI Primitives</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">无障碍访问，开箱即用</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Framer Motion 12</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">声明式动画，性能优化</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Vite 5.4 构建</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">极速开发，优化打包</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">CVA 类型变体</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">强类型样式系统</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 relative z-10 bg-linear-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-900/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="px-4 py-2 text-sm mb-4 backdrop-blur-xl bg-blue-500/20">
                <Monitor className="w-4 h-4 inline mr-2 text-blue-500" />
                实时演示
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              立即体验组件
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              无需安装，在线体验组件的交互效果和主题切换
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            <motion.div variants={slideInFromLeft}>
              <ThemePreviewCard />
            </motion.div>
            <motion.div variants={slideInFromRight}>
              <InteractiveDemo />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <Badge className="px-4 py-2 text-sm mb-4 backdrop-blur-xl bg-green-500/20">
                <Code2 className="w-4 h-4 inline mr-2 text-green-500" />
                快速开始
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                三步开始使用
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                安装、导入、使用 - 就是这么简单
              </p>
            </motion.div>

            <motion.div variants={scaleIn}>
              <CodeExample />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                或者直接使用 CDN
              </p>
              <code className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                {"<script src=\"https://unpkg.com/@th-ui/core\"></script>"}
              </code>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={scaleIn}>
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-white" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              开始使用 TH-UI
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              立即体验现代化的 React 组件库
              <br />
              让你的应用焕然一新
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Link to="/components">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Box className="w-5 h-5 mr-2" />
                  浏览所有组件
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Github className="w-5 h-5 mr-2" />
                  在 GitHub 上点赞
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white"
            >
              {[
                { icon: Cpu, label: "高性能" },
                { icon: Smartphone, label: "响应式" },
                { icon: Moon, label: "暗色模式" },
                { icon: Sparkles, label: "流畅动画" }
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon className="w-8 h-8" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TH-UI
              </div>
              <p className="text-gray-400 text-sm">
                现代化 React 组件库
              </p>
            </div>

            <div className="flex gap-8 text-sm">
              <Link to="/components" className="text-gray-400 hover:text-white transition-colors">
                组件
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                文档
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                源码
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                更新日志
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>TH-UI v0.1.0 | 基于 Trans-Hub 设计系统</p>
            <p className="mt-2">MIT License © 2025 TH-UI Team</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
