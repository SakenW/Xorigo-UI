import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from '@storybook/test'
import Transition from './transition'
import { transitionPresets, createTransition } from './transition'

const meta: Meta<typeof Transition> = {
  title: 'Utilities/Transition',
  component: Transition,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Transition 是一个功能强大的过渡动画组件，支持多种过渡效果和自定义配置。

## 主要特性

- 🎬 **多种过渡类型**: fade, slide, scale, flip, rotate, bounce, spring, keyframes
- 🎯 **方向控制**: up, down, left, right, center
- ⚙️ **自定义配置**: duration, delay, easing, stiffness, damping
- 👶 **children动画**: 支持子元素错位动画
- 🎭 **AnimatePresence**: 支持进入/退出动画
- 🎨 **主题集成**: 与 Xorigo UI 主题系统完美集成

## 基本用法

\`\`\`tsx
import { Transition } from '@xorigo-ui/core/utilities'

<Transition config={{ type: 'fade', duration: 0.3 }}>
  <div>动画内容</div>
</Transition>
\`\`\`

## 预设配置

\`\`\`tsx
<Transition config={transitionPresets.fadeIn}>
  <div>淡入动画</div>
</Transition>

<Transition config={transitionPresets.slideUp}>
  <div>向上滑入</div>
</Transition>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      control: 'boolean',
      description: '控制过渡的显示/隐藏状态'
    },
    config: {
      control: 'object',
      description: '过渡配置对象'
    },
    animatePresence: {
      control: 'boolean',
      description: '是否使用 AnimatePresence 处理进入/退出动画'
    },
    animateChildren: {
      control: 'boolean',
      description: '是否为子元素添加动画'
    },
    staggerDelay: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '子元素动画的错位延迟'
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'header', 'footer'],
      description: '渲染的HTML标签'
    },
    onAnimationStart: {
      action: 'animationStarted',
      description: '动画开始时的回调'
    },
    onAnimationComplete: {
      action: 'animationCompleted',
      description: '动画完成时的回调'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Default: Story = {
  args: {
    show: true,
    children: (
      <div className="p-6 bg-primary text-primary-foreground rounded-lg">
        <h3 className="text-lg font-semibold mb-2">过渡动画示例</h3>
        <p>这是一个基础的过渡动画组件示例</p>
      </div>
    )
  }
}

// 淡入淡出动画
export const FadeAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'fade',
      duration: 0.5,
      easing: 'easeInOut'
    },
    children: (
      <div className="p-6 bg-secondary text-secondary-foreground rounded-lg">
        <h3 className="text-lg font-semibold mb-2">淡入淡出</h3>
        <p>这是一个淡入淡出动画效果</p>
      </div>
    )
  }
}

// 滑动动画
export const SlideAnimations: Story = {
  render: () => {
    const [show, setShow] = useState(true)

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShow(!show)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            {show ? '隐藏' : '显示'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Transition
            show={show}
            config={{ type: 'slide', direction: 'up', duration: 0.4 }}
          >
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <h4 className="font-semibold">向上滑动</h4>
              <p className="text-sm">从下方滑入</p>
            </div>
          </Transition>

          <Transition
            show={show}
            config={{ type: 'slide', direction: 'down', duration: 0.4 }}
          >
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <h4 className="font-semibold">向下滑动</h4>
              <p className="text-sm">从上方滑入</p>
            </div>
          </Transition>

          <Transition
            show={show}
            config={{ type: 'slide', direction: 'left', duration: 0.4 }}
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <h4 className="font-semibold">向左滑动</h4>
              <p className="text-sm">从右侧滑入</p>
            </div>
          </Transition>

          <Transition
            show={show}
            config={{ type: 'slide', direction: 'right', duration: 0.4 }}
          >
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <h4 className="font-semibold">向右滑动</h4>
              <p className="text-sm">从左侧滑入</p>
            </div>
          </Transition>
        </div>
      </div>
    )
  }
}

// 缩放动画
export const ScaleAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'scale',
      scale: 0.5,
      duration: 0.4,
      easing: 'backOut'
    },
    children: (
      <div className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-2">缩放动画</h3>
        <p>从0.5倍缩放到1倍</p>
      </div>
    )
  }
}

// 弹性动画
export const BounceAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'bounce',
      stiffness: 400,
      damping: 10
    },
    children: (
      <div className="p-6 bg-yellow-400 text-yellow-900 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2">弹性动画</h3>
        <p>🎪 弹性进入效果</p>
      </div>
    )
  }
}

// 弹簧动画
export const SpringAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      mass: 1
    },
    children: (
      <div className="p-6 bg-teal-500 text-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">弹簧动画</h3>
        <p>自然的物理动画效果</p>
      </div>
    )
  }
}

// 翻转动画
export const FlipAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'flip',
      rotate: 180,
      duration: 0.6,
      easing: 'easeInOut'
    },
    children: (
      <div className="p-6 bg-indigo-500 text-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">翻转动画</h3>
        <p>3D翻转进入效果</p>
      </div>
    )
  }
}

// 旋转动画
export const RotateAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'rotate',
      rotate: 360,
      duration: 0.8,
      easing: 'easeInOut'
    },
    children: (
      <div className="p-6 bg-pink-500 text-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">旋转动画</h3>
        <p>360度旋转进入</p>
      </div>
    )
  }
}

// 关键帧动画
export const KeyframesAnimation: Story = {
  args: {
    show: true,
    config: {
      type: 'keyframes',
      duration: 1.2,
      easing: 'easeInOut'
    },
    children: (
      <div className="p-6 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">关键帧动画</h3>
        <p>复杂的多阶段动画</p>
      </div>
    )
  }
}

// 子元素动画
export const ChildrenAnimation: Story = {
  args: {
    show: true,
    animateChildren: true,
    staggerDelay: 0.1,
    config: {
      type: 'fade',
      duration: 0.4
    },
    children: (
      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">子元素动画</h3>
        <div className="space-y-2">
          <div className="p-3 bg-primary/10 rounded">第一项</div>
          <div className="p-3 bg-primary/10 rounded">第二项</div>
          <div className="p-3 bg-primary/10 rounded">第三项</div>
          <div className="p-3 bg-primary/10 rounded">第四项</div>
        </div>
      </div>
    )
  }
}

// 预设配置展示
export const PresetsShowcase: Story = {
  render: () => {
    const [show, setShow] = useState(true)

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setShow(!show)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            {show ? '隐藏所有' : '显示所有'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Transition show={show} config={transitionPresets.fadeIn}>
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded text-center">
              <div className="text-2xl mb-2">🌅</div>
              <div className="font-semibold">fadeIn</div>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.slideUp}>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded text-center">
              <div className="text-2xl mb-2">⬆️</div>
              <div className="font-semibold">slideUp</div>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.scaleIn}>
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold">scaleIn</div>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.bounceIn}>
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">bounceIn</div>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.springIn}>
            <div className="p-4 bg-teal-100 dark:bg-teal-900 rounded text-center">
              <div className="text-2xl mb-2">🌊</div>
              <div className="font-semibold">springIn</div>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.dramatic}>
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded text-center">
              <div className="text-2xl mb-2">🎭</div>
              <div className="font-semibold">dramatic</div>
            </div>
          </Transition>
        </div>
      </div>
    )
  }
}

// 自定义配置
export const CustomConfiguration: Story = {
  args: {
    show: true,
    config: createTransition({
      type: 'slide',
      direction: 'up',
      duration: 0.6,
      delay: 0.2,
      easing: 'backOut',
      distance: 50
    }),
    children: (
      <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-xl">
        <h3 className="text-xl font-bold mb-2">自定义配置</h3>
        <p>延迟0.2秒，向上移动50px，使用backOut缓动</p>
      </div>
    )
  }
}

// 交互式演示
export const InteractiveDemo: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    const [animationType, setAnimationType] = useState('fade')
    const [duration, setDuration] = useState(0.4)

    const types = [
      { value: 'fade', label: '淡入淡出' },
      { value: 'slide', label: '滑动' },
      { value: 'scale', label: '缩放' },
      { value: 'bounce', label: '弹性' },
      { value: 'spring', label: '弹簧' },
      { value: 'flip', label: '翻转' },
      { value: 'rotate', label: '旋转' }
    ]

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">动画类型</label>
          <select
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            持续时间: {duration}s
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={() => setShow(!show)}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          {show ? '触发动画' : '显示内容'}
        </button>

        <Transition
          show={show}
          config={{ type: animationType as any, duration }}
          animatePresence={true}
          onAnimationStart={() => console.log('动画开始')}
          onAnimationComplete={() => setShow(false)}
        >
          <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">动画演示</h3>
            <p>当前配置: {types.find(t => t.value === animationType)?.label}</p>
            <p className="text-sm">持续时间: {duration}秒</p>
          </div>
        </Transition>
      </div>
    )
  }
}

// 主题集成测试
export const ThemeIntegration: Story = {
  render: () => {
    const [show, setShow] = useState(true)

    return (
      <div className="space-y-4">
        <button
          onClick={() => setShow(!show)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          切换显示
        </button>

        <div className="grid grid-cols-2 gap-4">
          <Transition show={show} config={transitionPresets.fadeIn}>
            <div className="p-4 bg-primary text-primary-foreground rounded-lg border-2 border-primary">
              <h4 className="font-semibold">Primary Theme</h4>
              <p className="text-sm">使用主题颜色</p>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.slideUp}>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg border-2 border-secondary">
              <h4 className="font-semibold">Secondary Theme</h4>
              <p className="text-sm">次要主题颜色</p>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.scaleIn}>
            <div className="p-4 bg-accent text-accent-foreground rounded-lg border-2 border-accent">
              <h4 className="font-semibold">Accent Theme</h4>
              <p className="text-sm">强调主题颜色</p>
            </div>
          </Transition>

          <Transition show={show} config={transitionPresets.bounceIn}>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg border-2 border-muted">
              <h4 className="font-semibold">Muted Theme</h4>
              <p className="text-sm">静默主题颜色</p>
            </div>
          </Transition>
        </div>
      </div>
    )
  }
}