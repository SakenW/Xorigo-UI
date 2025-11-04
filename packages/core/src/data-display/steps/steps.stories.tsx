import type { Meta, StoryObj } from '@storybook/react'
import { Steps, type StepItem } from './steps'
import { CheckIcon } from '../../primitives/Icon'

const meta = {
  title: 'Data Display/Steps',
  component: Steps,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '步骤指示器组件，用于展示多步骤流程的进度和当前状态。支持水平/垂直方向、多种状态、点击导航、可折叠和进度条等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '步骤方向',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '步骤尺寸',
    },
    currentStep: {
      control: { type: 'number', min: 0, max: 4 },
      description: '当前步骤索引',
    },
    allowClickNavigation: {
      control: 'boolean',
      description: '是否允许点击导航',
    },
    collapsible: {
      control: 'boolean',
      description: '是否支持可折叠',
    },
    showProgressBar: {
      control: 'boolean',
      description: '是否显示进度条',
    },
  },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

const defaultSteps: StepItem[] = [
  {
    id: 1,
    title: '基本信息',
    description: '填写个人基本信息',
  },
  {
    id: 2,
    title: '联系方式',
    description: '填写联系方式信息',
  },
  {
    id: 3,
    title: '身份验证',
    description: '验证身份信息',
  },
  {
    id: 4,
    title: '完成注册',
    description: '注册完成',
  },
]

export const Default: Story = {
  args: {
    items: defaultSteps,
    currentStep: 0,
  },
}

export const Horizontal: Story = {
  args: {
    items: defaultSteps,
    orientation: 'horizontal',
    currentStep: 1,
  },
}

export const Vertical: Story = {
  args: {
    items: defaultSteps,
    orientation: 'vertical',
    currentStep: 2,
  },
  parameters: {
    layout: 'padded',
  },
}

export const WithCustomIcons: Story = {
  args: {
    items: [
      {
        id: 1,
        title: '用户信息',
        description: '填写用户信息',
        icon: <CheckIcon className="w-4 h-4" />,
        status: 'completed' as const,
      },
      {
        id: 2,
        title: '账户设置',
        description: '配置账户选项',
        icon: <CheckIcon className="w-4 h-4" />,
        status: 'inProgress' as const,
      },
      {
        id: 3,
        title: '安全验证',
        description: '完成安全设置',
      },
      {
        id: 4,
        title: '完成',
        description: '设置完成',
      },
    ],
    orientation: 'vertical',
    currentStep: 1,
  },
  parameters: {
    layout: 'padded',
  },
}

export const WithClickNavigation: Story = {
  args: {
    items: defaultSteps,
    allowClickNavigation: true,
    currentStep: 0,
  },
  render: (args) => {
    const [currentStep, setCurrentStep] = React.useState(0)
    return (
      <div style={{ width: '800px' }}>
        <Steps
          {...args}
          currentStep={currentStep}
          onStepClick={(index) => setCurrentStep(index)}
        />
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>当前步骤: {currentStep + 1}</p>
          <p>点击任意步骤进行导航</p>
        </div>
      </div>
    )
  },
}

export const WithCollapsibleSteps: Story = {
  args: {
    items: [
      {
        id: 1,
        title: '步骤 1：基础信息',
        description: '填写基础信息',
        isCollapsible: true,
        customContent: (
          <div style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
            <p>这里可以放置详细的表单内容或说明信息。</p>
            <p>包括输入字段、验证规则等。</p>
          </div>
        ),
      },
      {
        id: 2,
        title: '步骤 2：详细信息',
        description: '填写详细信息',
        isCollapsible: true,
        customContent: (
          <div style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
            <p>额外的详细信息内容。</p>
          </div>
        ),
      },
      {
        id: 3,
        title: '步骤 3：确认信息',
        description: '确认并提交',
        isCollapsible: true,
        customContent: (
          <div style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
            <p>最终确认信息并提交。</p>
          </div>
        ),
      },
    ],
    orientation: 'vertical',
    collapsible: true,
    defaultExpanded: [true, false, false],
  },
  parameters: {
    layout: 'padded',
  },
}

export const WithProgressBar: Story = {
  args: {
    items: defaultSteps,
    showProgressBar: true,
    currentStep: 2,
  },
  render: (args) => {
    const [currentStep, setCurrentStep] = React.useState(2)
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
      setProgress(((currentStep + 1) / defaultSteps.length) * 100)
    }, [currentStep])

    return (
      <div style={{ width: '800px' }}>
        <Steps
          {...args}
          currentStep={currentStep}
          onStepClick={(index) => setCurrentStep(index)}
          onProgressUpdate={(percentage) => setProgress(percentage)}
        />
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>当前进度: {Math.round(progress)}%</p>
          <p>当前步骤: {currentStep + 1} / {defaultSteps.length}</p>
        </div>
      </div>
    )
  },
}

export const WithDifferentStatuses: Story = {
  args: {
    items: [
      {
        id: 1,
        title: '已完成步骤',
        description: '此步骤已完成',
        status: 'completed' as const,
      },
      {
        id: 2,
        title: '进行中步骤',
        description: '此步骤正在进行',
        status: 'inProgress' as const,
      },
      {
        id: 3,
        title: '待处理步骤',
        description: '等待处理的步骤',
        status: 'pending' as const,
      },
      {
        id: 4,
        title: '错误步骤',
        description: '此步骤出现错误',
        status: 'error' as const,
      },
      {
        id: 5,
        title: '跳过步骤',
        description: '此步骤被跳过',
        status: 'skipped' as const,
      },
    ],
    orientation: 'vertical',
  },
  parameters: {
    layout: 'padded',
  },
}

export const SmallSize: Story = {
  args: {
    items: defaultSteps,
    size: 'sm',
    currentStep: 1,
  },
}

export const LargeSize: Story = {
  args: {
    items: defaultSteps,
    size: 'lg',
    currentStep: 2,
  },
}

export const WithDisabledSteps: Story = {
  args: {
    items: [
      {
        id: 1,
        title: '可用步骤',
        description: '可以点击的步骤',
      },
      {
        id: 2,
        title: '禁用步骤',
        description: '无法点击的步骤',
        disabled: true,
      },
      {
        id: 3,
        title: '可用步骤',
        description: '可以点击的步骤',
      },
    ],
    allowClickNavigation: true,
  },
}

export const ComplexExample: Story = {
  args: {
    items: [
      {
        id: 1,
        title: '选择产品',
        description: '从产品目录中选择',
        status: 'completed' as const,
        icon: <CheckIcon className="w-4 h-4" />,
      },
      {
        id: 2,
        title: '配置选项',
        description: '自定义产品配置',
        status: 'inProgress' as const,
        isCollapsible: true,
        customContent: (
          <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '4px', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>配置选项</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>颜色：蓝色、红色、绿色</li>
              <li>尺寸：小、中、大</li>
              <li>材质：塑料、金属、木质</li>
            </ul>
          </div>
        ),
      },
      {
        id: 3,
        title: '确认订单',
        description: '检查订单详情',
        status: 'pending' as const,
        isCollapsible: true,
        customContent: (
          <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '4px', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>订单摘要</h4>
            <p style={{ margin: 0 }}>产品配置和价格信息将在这里显示</p>
          </div>
        ),
      },
      {
        id: 4,
        title: '完成购买',
        description: '完成支付流程',
        status: 'pending' as const,
      },
    ],
    orientation: 'vertical',
    allowClickNavigation: true,
    collapsible: true,
    showProgressBar: true,
    currentStep: 1,
  },
  parameters: {
    layout: 'padded',
  },
}

// 导入React
import React from 'react'
