import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import Modal from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal size',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close on overlay click',
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

const ModalDemo = ({
  size = 'md',
  title = 'Modal Title',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} size={size}>
        <p className="text-gray-600">This is a modal dialog. You can put any content here.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const Small: Story = {
  render: () => <ModalDemo size="sm" title="Small Modal" />,
}

export const Large: Story = {
  render: () => <ModalDemo size="lg" title="Large Modal" />,
}

export const ExtraLarge: Story = {
  render: () => <ModalDemo size="xl" title="Extra Large Modal" />,
}

export const FullWidth: Story = {
  render: () => <ModalDemo size="full" title="Full Width Modal" />,
}

const FormModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Account" size="md">
        <form className="space-y-4">
          <Input label="Full Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="Enter password" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export const FormModal: Story = {
  render: () => <FormModalDemo />,
}

const NoTitleModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open No Title Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
        <p className="text-center text-gray-600">This modal has no title, just content.</p>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  )
}

export const NoTitle: Story = {
  render: () => <NoTitleModalDemo />,
}
