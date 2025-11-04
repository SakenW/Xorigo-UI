/**
 * CheckboxGroup Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CheckboxGroup } from './checkbox-group'

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Inputs/CheckboxGroup',
  component: CheckboxGroup
}

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { value: '1', label: 'Apple' },
  { value: '2', label: 'Banana' },
  { value: '3', label: 'Cherry' }
]

export const Default: Story = {
  args: {
    options
  }
}

export const WithSelectAll: Story = {
  args: {
    options,
    showSelectAll: true
  }
}

export const Horizontal: Story = {
  args: {
    options,
    direction: 'horizontal'
  }
}

export const PreSelected: Story = {
  args: {
    options,
    defaultValue: ['1', '3']
  }
}
