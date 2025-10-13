import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Base/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
]

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    options,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select your country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
    ],
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Select an option',
    options,
    value: 'option2',
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Select an option',
    options,
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Select an option',
    options,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Select...',
    options,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Select an option...',
    options,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled select',
    options,
  },
}

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'Select an option',
    options,
    errorMessage: 'This field is required',
  },
}

export const MultiSelect: Story = {
  args: {
    placeholder: 'Select multiple options',
    options,
    multiple: true,
  },
}

export const WithGroups: Story = {
  args: {
    placeholder: 'Select an option',
    options: [
      {
        label: 'Fruits',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'orange', label: 'Orange' },
        ],
      },
      {
        label: 'Vegetables',
        options: [
          { value: 'carrot', label: 'Carrot' },
          { value: 'broccoli', label: 'Broccoli' },
          { value: 'spinach', label: 'Spinach' },
        ],
      },
    ],
  },
}

export const WithSearch: Story = {
  args: {
    placeholder: 'Search and select...',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'nuxt', label: 'Nuxt.js' },
    ],
    searchable: true,
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80 space-y-4">
        <Select
          label="Controlled Select"
          placeholder="Select an option"
          options={options}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-gray-600">Selected value: {value || 'None'}</p>
      </div>
    )
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Category',
    placeholder: 'Select a category',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'business', label: 'Business' },
      { value: 'design', label: 'Design' },
    ],
    helperText: 'Choose the most relevant category for your content',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Select placeholder="Default" options={options} />
      <Select variant="outlined" placeholder="Outlined" options={options} />
      <Select variant="filled" placeholder="Filled" options={options} />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Select size="sm" placeholder="Small" options={options} />
      <Select size="md" placeholder="Medium" options={options} />
      <Select size="lg" placeholder="Large" options={options} />
    </div>
  ),
}

export const ComplexExample: Story = {
  render: () => {
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')

    const cities = {
      us: [
        { value: 'nyc', label: 'New York' },
        { value: 'la', label: 'Los Angeles' },
        { value: 'chicago', label: 'Chicago' },
      ],
      uk: [
        { value: 'london', label: 'London' },
        { value: 'manchester', label: 'Manchester' },
        { value: 'edinburgh', label: 'Edinburgh' },
      ],
    }

    return (
      <div className="space-y-4 w-80">
        <Select
          label="Country"
          placeholder="Select country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
          ]}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setCity('')
          }}
        />
        <Select
          label="City"
          placeholder={country ? 'Select city' : 'Select country first'}
          options={cities[country as keyof typeof cities] || []}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!country}
        />
        {city && (
          <p className="text-sm text-green-600">
            Selected: {country} - {city}
          </p>
        )}
      </div>
    )
  },
}