/**
 * NavLink Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { NavLink } from './nav-link'

const meta: Meta<typeof NavLink> = {
  title: 'Navigation/NavLink',
  component: NavLink
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/home',
    children: 'Home'
  }
}

export const Active: Story = {
  args: {
    href: '/home',
    active: true,
    children: 'Home'
  }
}

export const Underline: Story = {
  args: {
    href: '/home',
    variant: 'underline',
    children: 'Home'
  }
}

export const Filled: Story = {
  args: {
    href: '/home',
    variant: 'filled',
    children: 'Home'
  }
}

export const Disabled: Story = {
  args: {
    href: '/home',
    disabled: true,
    children: 'Disabled Link'
  }
}
