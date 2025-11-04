/**
 * Link Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './link'

const meta: Meta<typeof Link> = {
  title: 'Navigation/Link',
  component: Link
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/home',
    children: 'Home'
  }
}

export const Primary: Story = {
  args: {
    href: '/home',
    variant: 'primary',
    children: 'Primary Link'
  }
}

export const Secondary: Story = {
  args: {
    href: '/about',
    variant: 'secondary',
    children: 'Secondary Link'
  }
}

export const Muted: Story = {
  args: {
    href: '/help',
    variant: 'muted',
    children: 'Muted Link'
  }
}

export const External: Story = {
  args: {
    href: 'https://example.com',
    external: true,
    children: 'External Link'
  }
}

export const WithoutUnderline: Story = {
  args: {
    href: '/home',
    underline: false,
    children: 'No Underline'
  }
}
