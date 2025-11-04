/**
 * NavMenu Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { NavMenu } from './nav-menu'

const meta: Meta<typeof NavMenu> = {
  title: 'Navigation/NavMenu',
  component: NavMenu
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', href: '/', icon: <span>🏠</span> },
      { id: '2', label: 'About', href: '/about', icon: <span>ℹ️</span> },
      { id: '3', label: 'Contact', href: '/contact', icon: <span>📧</span> }
    ]
  }
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    items: [
      { id: '1', label: 'Dashboard', href: '/dashboard' },
      { id: '2', label: 'Analytics', href: '/analytics' },
      { id: '3', label: 'Settings', href: '/settings' }
    ]
  }
}
