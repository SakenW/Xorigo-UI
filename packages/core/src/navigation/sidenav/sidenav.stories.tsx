/**
 * Sidenav Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Sidenav } from './sidenav'

const meta: Meta<typeof Sidenav> = {
  title: 'Navigation/Sidenav',
  component: Sidenav
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', icon: <span>🏠</span> },
      { id: '2', label: 'About', icon: <span>ℹ️</span> }
    ]
  }
}

export const Collapsed: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', icon: <span>🏠</span> },
      { id: '2', label: 'About', icon: <span>ℹ️</span> }
    ],
    collapsed: true
  }
}
