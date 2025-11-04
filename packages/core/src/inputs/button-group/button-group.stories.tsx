/**
 * ButtonGroup Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup } from './button-group'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Inputs/ButtonGroup',
  component: ButtonGroup
}

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'Three' }
]

export const Default: Story = {
  args: {
    options
  }
}

export const SingleSelect: Story = {
  args: {
    options,
    defaultValue: '2'
  }
}

export const MultiSelect: Story = {
  args: {
    options,
    multiple: true,
    defaultValue: ['1', '3']
  }
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <ButtonGroup options={options} variant="default" />
      <ButtonGroup options={options} variant="outline" />
      <ButtonGroup options={options} variant="solid" />
      <ButtonGroup options={options} variant="ghost" />
    </div>
  )
}
