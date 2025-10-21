import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Base/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search products...',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search...',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Search...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Search...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'React components',
    placeholder: 'Search...',
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80 space-y-4">
        <SearchInput
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-gray-600">Searching for: {value || 'Nothing'}</p>
      </div>
    )
  },
}

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Initial search')
    return (
      <SearchInput
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    )
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <SearchInput placeholder="Search products..." />
      <SearchInput placeholder="Search users..." />
      <SearchInput placeholder="Search documents..." />
    </div>
  ),
}