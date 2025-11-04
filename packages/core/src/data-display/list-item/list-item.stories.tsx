import type { Meta, StoryObj } from '@storybook/react'
import { ListItem } from './list-item'

const meta = {
  title: 'Data Display/List Item',
  component: ListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible list item component with support for avatars, icons, badges, and interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious'],
      description: 'Controls the spacing and font size',
    },
    interactive: {
      control: 'select',
      options: ['static', 'hoverable', 'clickable'],
      description: 'Controls the interactive behavior',
    },
    selected: {
      control: 'boolean',
      description: 'Controls the selected state',
    },
    disabled: {
      control: 'boolean',
      description: 'Controls the disabled state',
    },
    avatarSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Controls the avatar size',
    },
    iconSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Controls the icon size',
    },
    badgeVariant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'success', 'warning'],
      description: 'Controls the badge variant',
    },
    badgeSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Controls the badge size',
    },
    multiline: {
      control: 'boolean',
      description: 'Enables multiline content layout',
    },
    selectable: {
      control: 'boolean',
      description: 'Shows a checkbox for selection',
    },
    draggable: {
      control: 'boolean',
      description: 'Enables drag and drop',
    },
  },
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

// Basic List Item
export const Basic: Story = {
  args: {
    title: 'List Item',
  },
}

// With Description
export const WithDescription: Story = {
  args: {
    title: 'List Item',
    description: 'This is a description of the list item',
  },
}

// With Avatar
export const WithAvatar: Story = {
  args: {
    title: 'John Doe',
    description: 'john.doe@example.com',
    avatar: (
      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
        JD
      </div>
    ),
  },
}

// With Icon
export const WithIcon: Story = {
  args: {
    title: 'Settings',
    description: 'Manage your preferences',
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
}

// With Badge
export const WithBadge: Story = {
  args: {
    title: 'Notifications',
    badge: '5',
    badgeVariant: 'destructive',
  },
}

// With Actions
export const WithActions: Story = {
  args: {
    title: 'Email Message',
    description: 'Important email requires your attention',
    actions: (
      <>
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Reply
        </button>
        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Archive
        </button>
      </>
    ),
  },
}

// Selected State
export const Selected: Story = {
  args: {
    title: 'Selected Item',
    description: 'This item is selected',
    selected: true,
  },
}

// Disabled State
export const Disabled: Story = {
  args: {
    title: 'Disabled Item',
    description: 'This item is disabled',
    disabled: true,
  },
}

// Compact Density
export const CompactDensity: Story = {
  args: {
    title: 'Compact List Item',
    description: 'Smaller spacing and font size',
    density: 'compact',
  },
}

// Spacious Density
export const SpaciousDensity: Story = {
  args: {
    title: 'Spacious List Item',
    description: 'Larger spacing and font size',
    density: 'spacious',
  },
}

// Hoverable Interactive
export const Hoverable: Story = {
  args: {
    title: 'Hoverable Item',
    description: 'Changes background on hover',
    interactive: 'hoverable',
  },
}

// Clickable Interactive
export const Clickable: Story = {
  args: {
    title: 'Clickable Item',
    description: 'Active state on click',
    interactive: 'clickable',
  },
}

// Selectable
export const Selectable: Story = {
  args: {
    title: 'Selectable Item',
    description: 'Can be selected with checkbox',
    selectable: true,
  },
}

// Draggable
export const Draggable: Story = {
  args: {
    title: 'Draggable Item',
    description: 'Can be dragged and dropped',
    draggable: true,
  },
}

// Multiline
export const Multiline: Story = {
  args: {
    title: 'Multiline Item',
    description: 'This item supports multiline content and displays additional text below',
    multiline: true,
    children: (
      <div>
        {`This is additional content that appears on a new line.
It can contain multiple paragraphs and more detailed information.
The component will automatically adjust the layout for multiline content.`}
      </div>
    ),
  },
}

// With Caption
export const WithCaption: Story = {
  args: {
    title: 'File Upload',
    description: 'document.pdf',
    caption: 'Updated 2 hours ago',
  },
}

// Complex Example
export const ComplexExample: Story = {
  args: {
    title: 'Alice Johnson',
    description: 'alice.johnson@example.com',
    caption: 'Online',
    avatar: (
      <div className="h-full w-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-semibold">
        AJ
      </div>
    ),
    badge: '3',
    badgeVariant: 'success',
    selectable: true,
    interactive: 'hoverable',
    actions: (
      <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    ),
  },
}

// With Indicator
export const WithIndicator: Story = {
  args: {
    title: 'Important Task',
    description: 'Requires immediate attention',
    indicator: <div className="h-full w-1 bg-red-500 rounded-r" />,
  },
}

// Hover Content
export const WithHoverContent: Story = {
  args: {
    title: 'Email',
    description: '10 unread messages',
    hoverContent: (
      <div className="flex gap-2">
        <button className="p-1 text-blue-600 hover:text-blue-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="p-1 text-green-600 hover:text-green-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    ),
    showHoverContent: true,
  },
}
