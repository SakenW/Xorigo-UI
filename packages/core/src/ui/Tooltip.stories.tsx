import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'dark', 'light'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <button>Hover me</button>,
  },
}

export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    position: 'top',
    children: <button>Top tooltip</button>,
  },
}

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    position: 'bottom',
    children: <button>Bottom tooltip</button>,
  },
}

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    position: 'left',
    children: <button>Left tooltip</button>,
  },
}

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    position: 'right',
    children: <button>Right tooltip</button>,
  },
}

export const ClickTrigger: Story = {
  args: {
    content: 'Click to dismiss',
    trigger: 'click',
    children: <button>Click me</button>,
  },
}

export const FocusTrigger: Story = {
  args: {
    content: 'Focused tooltip',
    trigger: 'focus',
    children: <input placeholder="Focus me" />,
  },
}

export const Small: Story = {
  args: {
    content: 'Small tooltip',
    size: 'sm',
    children: <button>Small</button>,
  },
}

export const Large: Story = {
  args: {
    content: 'This is a large tooltip with more content',
    size: 'lg',
    children: <button>Large</button>,
  },
}

export const DarkVariant: Story = {
  args: {
    content: 'Dark tooltip',
    variant: 'dark',
    children: <button>Dark</button>,
  },
}

export const LightVariant: Story = {
  args: {
    content: 'Light tooltip',
    variant: 'light',
    children: <button>Light</button>,
  },
}

export const WithIcon: Story = {
  args: {
    content: 'Information about this feature',
    children: (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs">
        ℹ
      </span>
    ),
  },
}

export const WithRichContent: Story = {
  args: {
    content: (
      <div className="p-2">
        <h4 className="font-semibold mb-1">Rich Content</h4>
        <p className="text-sm">This tooltip contains formatted content with multiple elements.</p>
      </div>
    ),
    children: <button>Rich content</button>,
  },
}

export const OnText: Story = {
  args: {
    content: 'Click to copy',
    children: <span className="text-blue-600 underline cursor-pointer">Copy this text</span>,
  },
}

export const OnLink: Story = {
  args: {
    content: 'Opens in new tab',
    children: <a href="#" className="text-blue-600 underline">External link</a>,
  },
}

export const DisabledElement: Story = {
  args: {
    content: 'This button is disabled',
    children: (
      <button disabled className="opacity-50 cursor-not-allowed">
        Disabled button
      </button>
    ),
  },
}

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <div className="text-center">
        <Tooltip content="Top tooltip" position="top">
          <button>Top</button>
        </Tooltip>
      </div>
      <div className="text-center">
        <Tooltip content="Bottom tooltip" position="bottom">
          <button>Bottom</button>
        </Tooltip>
      </div>
      <div className="text-center">
        <Tooltip content="Left tooltip" position="left">
          <button>Left</button>
        </Tooltip>
      </div>
      <div className="text-center">
        <Tooltip content="Right tooltip" position="right">
          <button>Right</button>
        </Tooltip>
      </div>
      <div className="text-center">
        <Tooltip content="Click tooltip" trigger="click">
          <button>Click</button>
        </Tooltip>
      </div>
      <div className="text-center">
        <Tooltip content="Focus tooltip" trigger="focus">
          <input placeholder="Focus" />
        </Tooltip>
      </div>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Default tooltip" variant="default">
        <button>Default</button>
      </Tooltip>
      <Tooltip content="Dark tooltip" variant="dark">
        <button>Dark</button>
      </Tooltip>
      <Tooltip content="Light tooltip" variant="light">
        <button>Light</button>
      </Tooltip>
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <div className="relative">
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md pr-8"
            placeholder="Enter email"
          />
          <Tooltip content="We'll never share your email" position="right">
            <span className="absolute right-2 top-2.5 text-gray-400 cursor-help">
              ℹ
            </span>
          </Tooltip>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md pr-8"
            placeholder="Enter password"
          />
          <Tooltip content="Password must be at least 8 characters" position="right">
            <span className="absolute right-2 top-2.5 text-gray-400 cursor-help">
              ℹ
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
}

export const InteractiveExample: Story = {
  render: () => {
    const [count, setCount] = useState(0)

    return (
      <div className="space-y-4">
        <Tooltip content={`Current count: ${count}. Click to increment!`}>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Count: {count}
          </button>
        </Tooltip>
        <Tooltip content="Reset the counter">
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Reset
          </button>
        </Tooltip>
      </div>
    )
  },
}