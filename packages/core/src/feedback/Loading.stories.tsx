import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loading } from './Loading'

const meta: Meta<typeof Loading> = {
  title: 'Feedback/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'dots', 'pulse', 'bars'],
    },
    text: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithText: Story = {
  args: {
    text: 'Loading...',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    text: 'Loading...',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    text: 'Loading...',
  },
}

export const Dots: Story = {
  args: {
    variant: 'dots',
    text: 'Loading',
  },
}

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    text: 'Processing...',
  },
}

export const Bars: Story = {
  args: {
    variant: 'bars',
    text: 'Loading...',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Loading variant="default" />
        <span>Default</span>
      </div>
      <div className="flex items-center gap-4">
        <Loading variant="dots" />
        <span>Dots</span>
      </div>
      <div className="flex items-center gap-4">
        <Loading variant="pulse" />
        <span>Pulse</span>
      </div>
      <div className="flex items-center gap-4">
        <Loading variant="bars" />
        <span>Bars</span>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Loading size="sm" />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-4">
        <Loading size="md" />
        <span className="text-base">Medium</span>
      </div>
      <div className="flex items-center gap-4">
        <Loading size="lg" />
        <span className="text-lg">Large</span>
      </div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="p-6 border rounded-lg shadow-sm max-w-sm">
      <div className="flex flex-col items-center justify-center py-8">
        <Loading size="lg" text="Loading content..." />
      </div>
    </div>
  ),
}

export const FullScreen: Story = {
  render: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <Loading size="lg" text="Loading application..." />
      </div>
    </div>
  ),
}

export const InlineText: Story = {
  render: () => (
    <div className="space-y-2">
      <p>
        Saving document
        <Loading variant="dots" size="sm" />
      </p>
      <p>
        Uploading files
        <Loading variant="dots" size="sm" />
      </p>
      <p>
        Processing data
        <Loading variant="dots" size="sm" />
      </p>
    </div>
  ),
}

export const WithProgress: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Upload Progress</span>
          <span className="text-sm text-gray-600">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="mt-2">
          <Loading text="Uploading files..." />
        </div>
      </div>
    </div>
  ),
}