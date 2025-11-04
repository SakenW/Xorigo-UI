/**
 * Stepper Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Stepper } from './stepper'

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    steps: [
      { id: '1', label: 'Step 1', description: 'First step' },
      { id: '2', label: 'Step 2', description: 'Second step' },
      { id: '3', label: 'Step 3', description: 'Third step' }
    ],
    currentStep: 1
  }
}

export const Completed: Story = {
  args: {
    steps: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' }
    ],
    currentStep: 2
  }
}
