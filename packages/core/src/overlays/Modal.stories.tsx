import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../base/Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {
    open: true,
    title: 'Default Modal',
    children: <p>This is a default modal with basic content.</p>,
  },
}

export const WithFooter: Story = {
  args: {
    open: true,
    title: 'Modal with Footer',
    children: <p>This modal has action buttons in the footer.</p>,
    footer: (
      <div className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    ),
  },
}

export const Small: Story = {
  args: {
    open: true,
    title: 'Small Modal',
    size: 'sm',
    children: <p>This is a small sized modal.</p>,
  },
}

export const Large: Story = {
  args: {
    open: true,
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div>
        <p>This is a large sized modal with more space for content.</p>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Additional Content</h4>
          <p>Large modals are suitable for forms, detailed information, or complex interactions.</p>
        </div>
      </div>
    ),
    footer: (
      <div className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    ),
  },
}

export const ControlledModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Controlled Modal"
        >
          <p>This modal is controlled by React state.</p>
          <p className="mt-2">Click the close button or press ESC to close.</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [openModal, setOpenModal] = useState<string | null>(null)

    const sizes = [
      { name: 'Small', value: 'sm' },
      { name: 'Medium', value: 'md' },
      { name: 'Large', value: 'lg' },
      { name: 'Extra Large', value: 'xl' },
      { name: 'Full Screen', value: 'full' },
    ]

    return (
      <div>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <Button
              key={size.value}
              variant="outline"
              onClick={() => setOpenModal(size.value)}
            >
              {size.name}
            </Button>
          ))}
        </div>

        {sizes.map((size) => (
          <Modal
            key={size.value}
            open={openModal === size.value}
            onClose={() => setOpenModal(null)}
            title={`${size.name} Modal`}
            size={size.value as any}
          >
            <p>This is a {size.name.toLowerCase()} modal.</p>
            {size.value === 'full' && (
              <p className="mt-2">Full screen modals take up the entire viewport.</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenModal(null)}>
                Close
              </Button>
            </div>
          </Modal>
        ))}
      </div>
    )
  },
}