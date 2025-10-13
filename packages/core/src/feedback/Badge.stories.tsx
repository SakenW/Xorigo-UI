import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../base/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Feedback/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <span className="mr-1">✓</span>
        Complete
      </Badge>
      <Badge variant="error">
        <span className="mr-1">✕</span>
        Failed
      </Badge>
      <Badge variant="warning">
        <span className="mr-1">⚠</span>
        Warning
      </Badge>
      <Badge variant="info">
        <span className="mr-1">ℹ</span>
        Info
      </Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="success" size="sm">Active</Badge>
        <span>User is currently active</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="warning" size="sm">Pending</Badge>
        <span>Awaiting approval</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="error" size="sm">Inactive</Badge>
        <span>User account disabled</span>
      </div>
    </div>
  ),
}

export const CountBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge variant="primary">5</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Notifications</span>
        <Badge variant="error">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Updates</span>
        <Badge variant="success">New</Badge>
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="space-y-2">
      {['Default', 'Primary', 'Success', 'Warning', 'Error', 'Info'].map((variant) => (
        <button
          key={variant}
          className="p-2 border rounded hover:bg-gray-50 transition-colors"
        >
          Clickable {variant}
          <Badge variant={variant.toLowerCase()} className="ml-2">
            {variant[0]}
          </Badge>
        </button>
      ))}
    </div>
  ),
}