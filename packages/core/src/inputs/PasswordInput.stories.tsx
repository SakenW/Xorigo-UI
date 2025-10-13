import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PasswordInput } from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'Base/PasswordInput',
  component: PasswordInput,
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
    error: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter password',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Password',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Enter password',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled password',
  },
}

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'Enter password',
    errorMessage: 'Password is required',
  },
}

export const WithValue: Story = {
  args: {
    value: 'secret123',
    placeholder: 'Enter password',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    helperText: 'Password must be at least 8 characters long',
  },
}

export const WithErrorAndHelper: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: true,
    errorMessage: 'Password too short',
    helperText: 'Must include uppercase, lowercase, and numbers',
  },
}

export const Controlled: Story = {
  render: () => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="w-80 space-y-4">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onToggleVisibility={() => setShowPassword(!showPassword)}
        />
        <div className="text-sm space-y-1">
          <p>Password: {password ? '•'.repeat(password.length) : 'Empty'}</p>
          <p>Visible: {showPassword ? 'Yes' : 'No'}</p>
          <p>Length: {password.length} characters</p>
        </div>
      </div>
    )
  },
}

export const StrengthIndicator: Story = {
  render: () => {
    const [password, setPassword] = useState('')

    const getStrength = (pwd: string) => {
      if (!pwd) return { level: 0, text: '', color: 'bg-gray-200' }
      if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' }
      if (pwd.length < 10) return { level: 2, text: 'Medium', color: 'bg-yellow-500' }
      return { level: 3, text: 'Strong', color: 'bg-green-500' }
    }

    const strength = getStrength(password)

    return (
      <div className="w-80 space-y-4">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded ${
                  level <= strength.level ? strength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-medium" style={{ color: strength.color.replace('bg-', 'text-') }}>
            Password strength: {strength.text || 'None'}
          </p>
        </div>
      </div>
    )
  },
}

export const FormValidation: Story = {
  render: () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showErrors, setShowErrors] = useState(false)

    const errors = {
      password: password.length < 8 ? 'Password must be at least 8 characters' : '',
      confirmPassword: password !== confirmPassword ? 'Passwords do not match' : '',
    }

    return (
      <div className="w-80 space-y-4">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={showErrors && !!errors.password}
          errorMessage={errors.password}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={showErrors && !!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
        />
        <button
          onClick={() => setShowErrors(true)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Validate
        </button>
        {!showErrors && password && confirmPassword && (
          <p className="text-sm text-green-600">Passwords appear to match</p>
        )}
      </div>
    )
  },
}