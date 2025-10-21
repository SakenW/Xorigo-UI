import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardContent, CardFooter } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Base/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'bordered', 'filled', 'glass', 'neumorphic', 'gradient', 'neon', 'outlined', 'interactive'],
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    hoverable: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-gray-600">This is a simple card with some content.</p>
      </div>
    ),
  },
}

export const WithHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-lg font-semibold">Card Header</h3>
        <p className="text-sm text-gray-600">Header description</p>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Action</button>
      </CardFooter>
    </Card>
  ),
}

export const Complete: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-lg font-semibold">Complete Card</h3>
        <p className="text-sm text-gray-600">Header description</p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This is the main content area with more detailed information.</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Created</span>
            <span className="text-sm font-medium">Today</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Save</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm">Cancel</button>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div className="w-80">
        <h3 className="text-lg font-semibold mb-2">Outlined Card</h3>
        <p className="text-gray-600">Card with outlined variant styling.</p>
      </div>
    ),
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div className="w-80">
        <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
        <p className="text-gray-600">Card with elevated shadow styling.</p>
      </div>
    ),
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <div className="w-80">
        <h3 className="text-lg font-semibold mb-2">Filled Card</h3>
        <p className="text-gray-600">Card with filled background styling.</p>
      </div>
    ),
  },
}

export const CustomDensity: Story = {
  render: () => (
    <div className="space-y-4">
      <Card density="compact" className="w-80">
        <h3 className="text-lg font-semibold">Compact Density</h3>
      </Card>
      <Card density="comfortable" className="w-80">
        <h3 className="text-lg font-semibold">Comfortable Density</h3>
      </Card>
      <Card density="spacious" className="w-80">
        <h3 className="text-lg font-semibold">Spacious Density</h3>
      </Card>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card className="w-80 hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-lg font-semibold">Interactive Card</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">Hover over this card to see the shadow effect.</p>
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Click Me
        </button>
      </CardContent>
    </Card>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="default" className="w-40">
        <CardContent>
          <h4 className="font-medium">Default</h4>
        </CardContent>
      </Card>
      <Card variant="outlined" className="w-40">
        <CardContent>
          <h4 className="font-medium">Outlined</h4>
        </CardContent>
      </Card>
      <Card variant="elevated" className="w-40">
        <CardContent>
          <h4 className="font-medium">Elevated</h4>
        </CardContent>
      </Card>
      <Card variant="filled" className="w-40">
        <CardContent>
          <h4 className="font-medium">Filled</h4>
        </CardContent>
      </Card>
    </div>
  ),
}