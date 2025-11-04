/**
 * SegmentedControl Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControl } from './segmented-control'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
      { value: 'three', label: 'Three' }
    ]
  }
}

export const WithIcons: Story = {
  args: {
    options: [
      { value: 'list', label: 'List', icon: <span>📋</span> },
      { value: 'grid', label: 'Grid', icon: <span>⊞</span> },
      { value: 'map', label: 'Map', icon: <span>🗺️</span> }
    ]
  }
}

export const Small: Story = {
  args: {
    size: 'sm',
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ]
  }
}

export const Large: Story = {
  args: {
    size: 'lg',
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ]
  }
}
