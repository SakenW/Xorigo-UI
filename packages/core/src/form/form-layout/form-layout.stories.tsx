import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FormLayout, FormSection, FormGroup, FormSectionHeader } from './form-layout'
import { FormField } from '../form-field'

// ==============================
// Meta Configuration
// ==============================

const meta = {
  title: 'Form/FormLayout',
  component: FormLayout,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible form layout component that provides multiple layout patterns including single column,
double column, triple column, and grid layouts. It also supports responsive design,
customizable spacing, label positioning, and section management.

## Features
- Multiple layout modes (single, double, triple, grid, custom)
- Responsive design with breakpoint configuration
- Configurable label positioning (top, left, right, floating)
- Customizable gaps and section spacing
- Form section management with collapsible sections
- Support for form groups with column spans
- TypeScript support with full type safety
- Accessible by default

## Usage
\`\`\`tsx
<FormLayout layout="double" gap="md" labelPosition="top">
  <FormGroup label="Email" required>
    <input type="email" />
  </FormGroup>
  <FormGroup label="Password" required>
    <input type="password" />
  </FormGroup>
</FormLayout>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['single', 'double', 'triple', 'grid', 'custom'],
      description: 'Layout mode for the form',
    },
    columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of columns for grid layout',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Gap size between form elements',
    },
    labelWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Width of labels in left/right position',
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'left', 'right', 'floating'],
      description: 'Position of labels relative to controls',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of form elements',
    },
    sectionSpacing: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Spacing between form sections',
    },
    responsive: {
      control: 'boolean',
      description: 'Enable responsive behavior',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all form elements',
    },
  },
} satisfies Meta<typeof FormLayout>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// Story Examples
// ==============================

export const Default: Story = {
  args: {
    children: (
      <>
        <FormGroup label="Field 1" description="This is the first field">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 2" required>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 3" error="This field is required">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const DoubleColumn: Story = {
  args: {
    layout: 'double',
    gap: 'md',
    children: (
      <>
        <FormGroup label="First Name" required>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Last Name" required>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Email" required>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Phone">
          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="City">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Country">
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option>Select a country</option>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-4xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const TripleColumn: Story = {
  args: {
    layout: 'triple',
    gap: 'lg',
    children: (
      <>
        <FormGroup label="Field 1">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 2">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 3">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 4">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 5">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 6">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-6xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const GridWithCustomColumns: Story = {
  args: {
    layout: 'grid',
    columns: 3,
    gap: 'md',
    children: (
      <>
        <FormGroup label="Full Width Field" columns={3}>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Half Width Field">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Half Width Field">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="One Third Width">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="One Third Width">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="One Third Width">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-5xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const WithSections: Story = {
  args: {
    layout: 'single',
    sectionSpacing: 'lg',
    children: (
      <>
        <FormSection
          title="Personal Information"
          description="Please provide your personal details"
          icon={<span>👤</span>}
        >
          <FormGroup label="First Name" required>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Last Name" required>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Date of Birth">
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
        </FormSection>

        <FormSection
          title="Contact Information"
          description="How can we reach you?"
          icon={<span>📧</span>}
        >
          <FormGroup label="Email" required>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Phone">
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Address">
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
          </FormGroup>
        </FormSection>

        <FormSection
          title="Account Settings"
          icon={<span>⚙️</span>}
        >
          <FormGroup label="Username" required>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Password" required>
            <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Confirm Password" required>
            <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
        </FormSection>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-3xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const CollapsibleSections: Story = {
  args: {
    layout: 'single',
    children: (
      <>
        <FormSection
          title="Basic Information"
          description="General information about you"
          collapsible
          defaultCollapsed
        >
          <FormGroup label="Name">
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Age">
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
        </FormSection>

        <FormSection
          title="Preferences"
          description="Your preferences and settings"
          collapsible
          defaultCollapsed
        >
          <FormGroup label="Newsletter">
            <input type="checkbox" className="mr-2" />
            Subscribe to newsletter
          </FormGroup>
          <FormGroup label="Notifications">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>All notifications</option>
              <option>Important only</option>
              <option>None</option>
            </select>
          </FormGroup>
        </FormSection>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-3xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const LeftLabelPosition: Story = {
  args: {
    layout: 'single',
    labelPosition: 'left',
    labelWidth: 'md',
    children: (
      <>
        <FormGroup label="First Name">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Last Name" required>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Email" required>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Phone">
          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-3xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const RightLabelPosition: Story = {
  args: {
    layout: 'single',
    labelPosition: 'right',
    labelWidth: 'md',
    children: (
      <>
        <FormGroup label="First Name">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Last Name" required>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Email" required>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Phone">
          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-3xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const DifferentVariants: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <FormLayout variant="default">
          <FormGroup label="Field 1">
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Field 2">
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
        </FormLayout>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Grouped Variant</h3>
        <FormLayout>
          <FormSection variant="grouped" title="Grouped Section">
            <FormGroup label="Field 1">
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </FormGroup>
            <FormGroup label="Field 2">
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </FormGroup>
          </FormSection>
        </FormLayout>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Card Variant</h3>
        <FormLayout>
          <FormSection variant="card" title="Card Section">
            <FormGroup label="Field 1">
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </FormGroup>
            <FormGroup label="Field 2">
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </FormGroup>
          </FormSection>
        </FormLayout>
      </div>
    </div>
  ),
}

export const ComplexForm: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <FormLayout layout="double" gap="lg" labelPosition="top">
        <FormSection
          title="User Profile"
          description="Create your user profile"
          icon={<span>👤</span>}
        >
          <FormGroup label="Username" required columns={2}>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Display Name" required>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Bio" columns={2}>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} />
          </FormGroup>
        </FormSection>

        <FormSection
          title="Contact Details"
          description="Your contact information"
          icon={<span>📧</span>}
          collapsible
        >
          <FormGroup label="Email" required>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Phone">
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Website">
            <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
          <FormGroup label="Location">
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </FormGroup>
        </FormSection>

        <FormSection
          title="Preferences"
          icon={<span>⚙️</span>}
        >
          <FormGroup label="Language">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </FormGroup>
          <FormGroup label="Timezone">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Pacific Time (PT)</option>
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
            </select>
          </FormGroup>
          <FormGroup label="Theme">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </FormGroup>
          <FormGroup label="Email Notifications">
            <input type="checkbox" className="mr-2" />
            Receive email notifications
          </FormGroup>
        </FormSection>
      </FormLayout>
    </div>
  ),
}

export const WithFieldError: Story = {
  args: {
    layout: 'double',
    children: (
      <>
        <FormGroup label="Email" required error="Please enter a valid email address">
          <input type="email" className="w-full px-3 py-2 border border-red-500 rounded-md" />
        </FormGroup>
        <FormGroup label="Username" required error="Username is required">
          <input type="text" className="w-full px-3 py-2 border border-red-500 rounded-md" />
        </FormGroup>
        <FormGroup label="Password" required>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Confirm Password" error="Passwords do not match">
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </>
    ),
  },
  render: (args) => (
    <div className="w-full max-w-4xl">
      <FormLayout {...args} />
    </div>
  ),
}

export const ResponsiveBreakpoints: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <FormLayout
        layout="grid"
        columns={12}
        gap="md"
        breakpoints={[
          { breakpoint: 'sm', columns: 1 },
          { breakpoint: 'md', columns: 6 },
          { breakpoint: 'lg', columns: 12 },
        ]}
      >
        <FormGroup label="Field 1">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 2">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 3">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 4">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 5">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
        <FormGroup label="Field 6">
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </FormGroup>
      </FormLayout>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This example demonstrates responsive behavior across different screen sizes',
      },
    },
  },
}
