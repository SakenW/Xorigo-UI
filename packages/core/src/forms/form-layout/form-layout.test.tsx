import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormLayout, FormSection, FormGroup, FormSectionHeader } from './form-layout'
import { Form } from '../forms-index'

// ==============================
// Test Utilities
// ==============================

const renderWithProviders = (component: React.ReactElement) => {
  return render(component)
}

// ==============================
// FormLayout Tests
// ==============================

describe('FormLayout', () => {
  it('renders with default props', () => {
    renderWithProviders(
      <FormLayout>
        <div data-testid="content">Test Content</div>
      </FormLayout>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('applies single column layout by default', () => {
    const { container } = renderWithProviders(
      <FormLayout data-testid="layout">
        <div>Content</div>
      </FormLayout>
    )

    expect(screen.getByTestId('layout')).toHaveClass('max-w-none')
  })

  it('applies double column layout', () => {
    const { container } = renderWithProviders(
      <FormLayout layout="double">
        <FormGroup label="Field 1">
          <input />
        </FormGroup>
        <FormGroup label="Field 2">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByLabelText('Field 1')).toBeInTheDocument()
  })

  it('applies triple column layout', () => {
    renderWithProviders(
      <FormLayout layout="triple">
        <FormGroup label="Field 1">
          <input />
        </FormGroup>
        <FormGroup label="Field 2">
          <input />
        </FormGroup>
        <FormGroup label="Field 3">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByLabelText('Field 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Field 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Field 3')).toBeInTheDocument()
  })

  it('applies custom column count', () => {
    renderWithProviders(
      <FormLayout layout="grid" columns={4}>
        <FormGroup label="Field 1">
          <input />
        </FormGroup>
        <FormGroup label="Field 2">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const layout = screen.getByLabelText('Field 1').closest('[data-label-position]')
    expect(layout).toHaveClass('grid-cols-1')
  })

  it('applies gap size variants', () => {
    const { rerender } = renderWithProviders(
      <FormLayout gap="sm">
        <div>Content</div>
      </FormLayout>
    )

    let layout = screen.getByText('Content').parentElement
    expect(layout).toHaveClass('gap-2')

    rerender(
      <FormLayout gap="lg">
        <div>Content</div>
      </FormLayout>
    )

    layout = screen.getByText('Content').parentElement
    expect(layout).toHaveClass('gap-6')
  })

  it('applies label position variants', () => {
    renderWithProviders(
      <FormLayout labelPosition="left">
        <FormGroup label="Field 1">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const group = screen.getByLabelText('Field 1').closest('[data-label-position]')
    expect(group).toHaveAttribute('data-label-position', 'left')
  })

  it('applies section spacing variants', () => {
    renderWithProviders(
      <FormLayout sectionSpacing="lg">
        <FormSection title="Section 1">
          <div>Content</div>
        </FormSection>
      </FormLayout>
    )

    const section = screen.getByText('Section 1').closest('div')
    expect(section).toHaveClass('space-y-6')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    renderWithProviders(
      <FormLayout ref={ref}>
        <div>Content</div>
      </FormLayout>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    renderWithProviders(
      <FormLayout className="custom-class">
        <div>Content</div>
      </FormLayout>
    )

    const layout = screen.getByText('Content').parentElement
    expect(layout).toHaveClass('custom-class')
  })
})

// ==============================
// FormSection Tests
// ==============================

describe('FormSection', () => {
  it('renders with title and description', () => {
    renderWithProviders(
      <FormSection title="Section Title" description="Section description">
        <div>Content</div>
      </FormSection>
    )

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section description')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { rerender } = renderWithProviders(
      <FormSection variant="grouped">
        <div>Content</div>
      </FormSection>
    )

    let section = screen.getByText('Content').closest('div')
    expect(section).toHaveClass('bg-gray-50', 'rounded-lg')

    rerender(
      <FormSection variant="card">
        <div>Content</div>
      </FormSection>
    )

    section = screen.getByText('Content').closest('div')
    expect(section).toHaveClass('bg-white', 'border')
  })

  it('applies spacing variants', () => {
    renderWithProviders(
      <FormSection spacing="lg" title="Section">
        <div>Content</div>
      </FormSection>
    )

    const section = screen.getByText('Content').closest('div')
    expect(section).toHaveClass('space-y-6')
  })

  it('supports collapsible sections', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <FormSection title="Section Title" collapsible>
        <div data-testid="content">Content</div>
      </FormSection>
    )

    expect(screen.getByTestId('content')).toBeVisible()

    const toggleButton = screen.getByRole('button', { expanded: false })
    await user.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByTestId('content')).not.toBeVisible()
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('supports custom icons', () => {
    const Icon = () => <span data-testid="icon">★</span>
    renderWithProviders(
      <FormSection title="Section" icon={<Icon />}>
        <div>Content</div>
      </FormSection>
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    renderWithProviders(
      <FormSection ref={ref}>
        <div>Content</div>
      </FormSection>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies default collapsed state', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <FormSection title="Section" collapsible defaultCollapsed>
        <div data-testid="content">Content</div>
      </FormSection>
    )

    expect(screen.getByTestId('content')).not.toBeVisible()

    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeVisible()
    })
  })
})

// ==============================
// FormGroup Tests
// ==============================

describe('FormGroup', () => {
  it('renders with label', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Field Label">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByLabelText('Field Label')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Required Field" required>
          <input />
        </FormGroup>
      </FormLayout>
    )

    const label = screen.getByLabelText('Required Field')
    expect(label.parentElement).toContainElement(screen.getByText('*'))
  })

  it('shows optional indicator when optional is true', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Optional Field" optional>
          <input />
        </FormGroup>
      </FormLayout>
    )

    const label = screen.getByLabelText('Optional Field')
    expect(label.parentElement).toContainElement(screen.getByText('(可选)'))
  })

  it('shows error message when error is provided', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Field" error="Field is required">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByText('Field is required')).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Field" description="Field description">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByText('Field description')).toBeInTheDocument()
  })

  it('applies column span', () => {
    renderWithProviders(
      <FormLayout layout="grid" columns={3}>
        <FormGroup columns={2}>
          <input />
        </FormGroup>
      </FormLayout>
    )

    const input = screen.getByRole('textbox')
    const group = input.closest('[data-label-position]')
    expect(group).toHaveClass('md:col-span-2')
  })

  it('applies label position variants', () => {
    renderWithProviders(
      <FormLayout labelPosition="left">
        <FormGroup labelPosition="left" labelWidth="md" label="Field">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const group = screen.getByLabelText('Field').closest('[data-label-position]')
    expect(group).toHaveAttribute('data-label-position', 'left')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    renderWithProviders(
      <FormLayout>
        <FormGroup ref={ref}>
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('generates unique IDs for multiple groups', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Field 1">
          <input />
        </FormGroup>
        <FormGroup label="Field 2">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).not.toHaveAttribute('id', '1')
    expect(inputs[1]).not.toHaveAttribute('id', '1')
  })
})

// ==============================
// FormSectionHeader Tests
// ==============================

describe('FormSectionHeader', () => {
  it('renders children', () => {
    renderWithProviders(
      <FormSectionHeader>Header Text</FormSectionHeader>
    )

    expect(screen.getByText('Header Text')).toBeInTheDocument()
  })

  it('applies size variants', () => {
    renderWithProviders(
      <FormSectionHeader size="lg">Header</FormSectionHeader>
    )

    const header = screen.getByText('Header').parentElement
    expect(header).toHaveClass('text-lg')
  })

  it('applies weight variants', () => {
    renderWithProviders(
      <FormSectionHeader weight="bold">Header</FormSectionHeader>
    )

    const header = screen.getByText('Header').parentElement
    expect(header).toHaveClass('font-bold')
  })

  it('applies spaced prop', () => {
    const { rerender } = renderWithProviders(
      <FormSectionHeader>Header</FormSectionHeader>
    )

    let header = screen.getByText('Header').parentElement
    expect(header).toHaveClass('mb-3')

    rerender(
      <FormSectionHeader spaced={false}>Header</FormSectionHeader>
    )

    header = screen.getByText('Header').parentElement
    expect(header).not.toHaveClass('mb-3')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    renderWithProviders(
      <FormSectionHeader ref={ref}>Header</FormSectionHeader>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

// ==============================
// Integration Tests
// ==============================

describe('FormLayout Integration', () => {
  it('works with Form component', async () => {
    const handleSubmit = vi.fn()

    renderWithProviders(
      <Form onSubmit={handleSubmit}>
        <FormLayout layout="double">
          <FormGroup label="Email" required>
            <input type="email" />
          </FormGroup>
          <FormGroup label="Password" required>
            <input type="password" />
          </FormGroup>
        </FormLayout>
      </Form>
    )

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  it('supports nested layouts', () => {
    renderWithProviders(
      <FormLayout layout="double">
        <FormGroup columns={2} label="Full Width">
          <input />
        </FormGroup>
        <FormGroup label="Half Width 1">
          <input />
        </FormGroup>
        <FormGroup label="Half Width 2">
          <input />
        </FormGroup>
      </FormLayout>
    )

    expect(screen.getByLabelText('Full Width')).toBeInTheDocument()
  })

  it('supports multiple sections', () => {
    renderWithProviders(
      <FormLayout>
        <FormSection title="Section 1">
          <FormGroup label="Field 1">
            <input />
          </FormGroup>
        </FormSection>
        <FormSection title="Section 2">
          <FormGroup label="Field 2">
            <input />
          </FormGroup>
        </FormSection>
      </FormLayout>
    )

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('applies responsive breakpoints', () => {
    renderWithProviders(
      <FormLayout
        layout="grid"
        columns={12}
        breakpoints={[
          { breakpoint: 'sm', columns: 1 },
          { breakpoint: 'md', columns: 6 },
          { breakpoint: 'lg', columns: 12 },
        ]}
      >
        <FormGroup>
          <input />
        </FormGroup>
      </FormLayout>
    )

    const layout = screen.getByRole('textbox').closest('[data-label-position]')
    expect(layout).toHaveAttribute('data-label-position', 'top')
  })

  it('handles disabled state', () => {
    renderWithProviders(
      <FormLayout disabled>
        <FormGroup label="Field">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const group = screen.getByLabelText('Field').closest('[data-label-position]')
    expect(group).toBeTruthy()
  })

  it('supports different label widths', () => {
    renderWithProviders(
      <FormLayout labelWidth="lg">
        <FormGroup label="Field">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const layout = screen.getByLabelText('Field').closest('[data-label-position]')
    expect(layout).toBeTruthy()
  })

  it('applies align variants', () => {
    renderWithProviders(
      <FormLayout align="center">
        <FormGroup label="Field">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const layout = screen.getByRole('textbox').closest('[data-label-position]')
    expect(layout).toHaveClass('items-center')
  })
})

// ==============================
// Accessibility Tests
// ==============================

describe('FormLayout Accessibility', () => {
  it('associates labels with inputs', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Email">
          <input type="email" />
        </FormGroup>
      </FormLayout>
    )

    const label = screen.getByLabelText('Email')
    expect(label.tagName).toBe('LABEL')
  })

  it('associates error messages with inputs', () => {
    renderWithProviders(
      <FormLayout>
        <FormGroup label="Email" error="Invalid email">
          <input />
        </FormGroup>
      </FormLayout>
    )

    const error = screen.getByText('Invalid email')
    expect(error).toHaveAttribute('role', 'alert')
  })

  it('supports aria-expanded for collapsible sections', () => {
    renderWithProviders(
      <FormSection title="Section" collapsible>
        <div>Content</div>
      </FormSection>
    )

    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('provides proper heading levels for sections', () => {
    renderWithProviders(
      <FormLayout>
        <FormSection title="Section Title">
          <FormSectionHeader>Subheader</FormSectionHeader>
        </FormSection>
      </FormLayout>
    )

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Subheader')).toBeInTheDocument()
  })
})
