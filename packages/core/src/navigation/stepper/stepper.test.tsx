/**
 * Stepper Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from './stepper'

const steps = [
  { id: '1', label: 'Step 1' },
  { id: '2', label: 'Step 2' },
  { id: '3', label: 'Step 3' }
]

describe('Stepper', () => {
  it('renders all steps', () => {
    render(<Stepper steps={steps} currentStep={1} />)
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
  })

  it('highlights current step', () => {
    render(<Stepper steps={steps} currentStep={1} />)
    const currentStep = screen.getByText('Step 2').previousElementSibling
    expect(currentStep).toHaveClass('bg-[var(--color-primary-500)]')
  })

  it('shows completed steps', () => {
    render(<Stepper steps={steps} currentStep={2} />)
    const completedStep = screen.getByText('Step 1').previousElementSibling
    expect(completedStep).toHaveClass('bg-[var(--color-success-500)]')
  })
})
