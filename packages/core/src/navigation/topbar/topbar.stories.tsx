/**
 * Topbar Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Topbar } from './topbar'

const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Topbar Content'
  }
}

export const Fixed: Story = {
  args: {
    fixed: true,
    children: 'Fixed Topbar'
  }
}

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    children: 'Bordered Topbar'
  }
}
