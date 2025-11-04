/**
 * AppShell Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { AppShell } from './app-shell'

const meta: Meta<typeof AppShell> = {
  title: 'Navigation/AppShell',
  component: AppShell
}

export default meta
type Story = StoryObj<typeof meta>

export const WithSidebar: Story = {
  render: () => (
    <AppShell
      header={<header className="h-16 bg-[var(--color-surface)] border-b">Header</header>}
      sidebar={<aside className="w-64 bg-[var(--color-surface)]">Sidebar</aside>}
    >
      <div className="p-6">Main Content Area</div>
    </AppShell>
  )
}

export const WithTopbar: Story = {
  render: () => (
    <AppShell
      layout="topbar"
      header={<header className="h-16 bg-[var(--color-surface)] border-b">Topbar</header>}
    >
      <div className="p-6">Main Content Area</div>
    </AppShell>
  )
}
