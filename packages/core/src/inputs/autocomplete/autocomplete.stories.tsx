/**
 * Autocomplete Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Autocomplete } from './autocomplete'

const meta: Meta<typeof Autocomplete> = {
  title: 'Inputs/Autocomplete',
  component: Autocomplete
}

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { value: '1', label: 'Apple' },
  { value: '2', label: 'Banana' },
  { value: '3', label: 'Cherry' },
  { value: '4', label: 'Date' },
  { value: '5', label: 'Elderberry' }
]

export const Default: Story = {
  args: {
    options
  }
}

export const WithPlaceholder: Story = {
  args: {
    options,
    placeholder: '选择水果...'
  }
}

export const Loading: Story = {
  args: {
    options,
    loading: true
  }
}

export const Clearable: Story = {
  args: {
    options,
    defaultValue: 'Apple',
    clearable: true
  }
}
