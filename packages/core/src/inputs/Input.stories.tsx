import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'neon', 'filled', 'outlined', 'underlined'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    type: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email...',
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled variant',
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined variant',
  },
}

export const Underlined: Story = {
  args: {
    variant: 'underlined',
    placeholder: 'Underlined variant',
  },
}

export const Neon: Story = {
  args: {
    variant: 'neon',
    placeholder: 'Neon variant',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const Error: Story = {
  args: {
    error: 'This field has an error',
    placeholder: 'Error state',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Password must be at least 8 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: 'Please enter a valid email address',
    helperText: 'This field is required',
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <Input
          label="Controlled Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
        />
        <p className="mt-2 text-sm text-gray-600">Current value: {value}</p>
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input variant="default" placeholder="Default" />
      <Input variant="filled" placeholder="Filled" />
      <Input variant="outlined" placeholder="Outlined" />
      <Input variant="underlined" placeholder="Underlined" />
      <Input variant="ghost" placeholder="Ghost" />
      <Input variant="neon" placeholder="Neon" />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Normal" placeholder="Normal state" />
      <Input label="Disabled" disabled placeholder="Disabled state" />
      <Input label="Error" error="This field has an error" placeholder="Error state" />
      <Input label="With helper" helperText="This is helper text" placeholder="With helper" />
    </div>
  ),
}