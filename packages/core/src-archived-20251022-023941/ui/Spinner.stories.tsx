import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Base/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Primary: Story = {
  args: {
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
}

export const Success: Story = {
  args: {
    color: 'success',
  },
}

export const Warning: Story = {
  args: {
    color: 'warning',
  },
}

export const Error: Story = {
  args: {
    color: 'error',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Spinner size="sm" />
        <p className="text-xs mt-1">Small</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="text-sm mt-1">Medium</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-base mt-1">Large</p>
      </div>
    </div>
  ),
}

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Spinner color="primary" />
        <p className="text-xs mt-1">Primary</p>
      </div>
      <div className="text-center">
        <Spinner color="secondary" />
        <p className="text-xs mt-1">Secondary</p>
      </div>
      <div className="text-center">
        <Spinner color="success" />
        <p className="text-xs mt-1">Success</p>
      </div>
      <div className="text-center">
        <Spinner color="warning" />
        <p className="text-xs mt-1">Warning</p>
      </div>
      <div className="text-center">
        <Spinner color="error" />
        <p className="text-xs mt-1">Error</p>
      </div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Loading...</span>
    </div>
  ),
}

export const InButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <button disabled className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">
        <Spinner size="sm" />
        Loading
      </button>
      <button disabled className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2">
        <Spinner color="secondary" size="sm" />
        Processing
      </button>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="p-6 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Loading Data</h3>
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
      <p className="text-center text-gray-600">Please wait while we load your content...</p>
    </div>
  ),
}

export const FullPage: Story = {
  render: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-700">Loading application...</p>
      </div>
    </div>
  ),
}