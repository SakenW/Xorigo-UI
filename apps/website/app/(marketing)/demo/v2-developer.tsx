'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Button, Card, Typography, Icon, Tabs, Code, Surface } from '@xorigo-ui/core'
import {
  Terminal as TerminalIcon,
  Copy,
  Check,
  Play,
  ChevronRight,
  Github,
  Code2,
  Palette,
  Box,
  Cpu,
  FileCode,
  Package,
  Rocket,
  ArrowRight
} from 'lucide-react'

/**
 * 方案2：开发者友好风
 * 特点：代码编辑器风格、终端美学、实时预览、交互式演示
 */

// 打字机效果组件
const TypewriterText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-3 h-6 bg-cyan-500 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  )
}

// 代码块组件
const CodeBlock = ({ code, language = 'tsx' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  )
}

// 终端组件
const TerminalComponent = ({ commands }: { commands: Array<{ cmd: string; output?: string }> }) => {
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    if (currentLine < commands.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentLine, commands.length])

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* 终端顶栏 */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-gray-400 text-xs ml-2">Terminal</span>
      </div>

      {/* 终端内容 */}
      <div className="p-4 font-mono text-sm">
        {commands.slice(0, currentLine).map((command, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-green-400">
              <span className="text-cyan-400">➜</span> {command.cmd}
            </div>
            {command.output && (
              <div className="text-gray-400 mt-1 ml-4">{command.output}</div>
            )}
          </motion.div>
        ))}
        {currentLine < commands.length && (
          <motion.span
            className="inline-block w-2 h-4 bg-green-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  )
}

// 组件预览器
const ComponentPreview = () => {
  const [activeTab, setActiveTab] = useState('preview')

  const buttonCode = `import { Button } from '@xorigo-ui/core'

export default function App() {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </Button>
  )
}`

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800">
      {/* 标签栏 */}
      <div className="flex border-b border-gray-800 bg-gray-950">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          代码
        </button>
      </div>

      {/* 内容区 */}
      <AnimatePresence mode="wait">
        {activeTab === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 bg-gray-950 min-h-[200px] flex items-center justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            >
              Click Me
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CodeBlock code={buttonCode} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default function DeveloperHome() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <FileCode className="w-6 h-6" />,
      title: "TypeScript 优先",
      description: "完整的类型定义，优秀的 IDE 支持",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "主题系统",
      description: "七轴 DTCG 配方，无限扩展可能",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "原子化设计",
      description: "可组合的组件，构建任意界面",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "极致性能",
      description: "React 19 + Vite 构建优化",
      color: "from-orange-500 to-red-500"
    }
  ]

  const installCommands = [
    { cmd: 'npm install @xorigo-ui/core', output: '✓ Package installed successfully' },
    { cmd: 'npm install @xorigo-ui/style-recipe', output: '✓ Style system ready' },
    { cmd: 'npm run dev', output: 'Server running at http://localhost:3100' }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 代码背景效果 */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.03) 2px,
            rgba(0, 255, 255, 0.03) 4px
          )`
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 标签 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6"
              >
                <Rocket className="w-3 h-3" />
                全新发布 • v0.1.0
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-gray-400">{'<'}</span>
                <TypewriterText text="Xorigo" />
                <span className="text-cyan-400">UI</span>
                <span className="text-gray-400">{' />'}</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                为 <span className="text-cyan-400 font-semibold">开发者</span> 打造的现代 React 组件库。
                <br />
                类型安全、性能优先、开发体验极致。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="group bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3"
                >
                  快速开始
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-gray-600 px-6 py-3"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                    }
                  }}
                >
                  <Github className="mr-2 w-5 h-5" />
                  View on GitHub
                </Button>
              </div>

              {/* 快速安装 */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                <TerminalIcon className="w-5 h-5 text-gray-400" />
                <code className="text-sm text-gray-300 font-mono">
                  npm install @xorigo-ui/core
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText('npm install @xorigo-ui/core')
                    }
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* 右侧终端 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TerminalComponent commands={installCommands} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-400">为什么</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                开发者喜欢
              </span>{' '}
              <span className="text-gray-400">Xorigo UI</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className={`p-6 bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 ${
                  hoveredFeature === index ? 'shadow-lg shadow-cyan-500/20' : ''
                }`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Preview Section */}
      <section className="py-32 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-400">实时</span>{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                组件预览
              </span>
            </h2>
            <p className="text-lg text-gray-500">
              交互式文档，所见即所得
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ComponentPreview />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-400">现代化</span>{' '}
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                技术栈
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'React 19', version: '^19.2.0', icon: '⚛️' },
              { name: 'TypeScript', version: '~5.9.3', icon: '🔷' },
              { name: 'Tailwind CSS', version: '^3.4.18', icon: '🎨' },
              { name: 'Framer Motion', version: '^12.23.5', icon: '✨' },
              { name: 'Vite', version: '^6.0.7', icon: '⚡' },
              { name: 'Vitest', version: '^2.1.6', icon: '🧪' },
              { name: 'Docker', version: 'Latest', icon: '🐳' },
              { name: 'DTCG', version: '七轴系统', icon: '🎯' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="p-6 bg-gray-900 border-gray-800 hover:border-gray-700">
                  <div className="text-4xl mb-3">{tech.icon}</div>
                  <div className="font-semibold text-white">{tech.name}</div>
                  <div className="text-sm text-gray-500">{tech.version}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="p-12 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <TypewriterText text="开始构建下一个项目" delay={100} />
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Xorigo UI - 由 Saken + AI 协作开发的现代组件库
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3"
              >
                <Package className="mr-2 w-5 h-5" />
                开始使用
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 px-8 py-3"
              >
                <Code2 className="mr-2 w-5 h-5" />
                查看文档
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Created by Saken + AI • MIT License • saken.w@gmail.com
              </p>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}