import type { Meta, StoryObj } from '@storybook/react'
import Card from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'hover', 'interactive'],
      description: 'Card variant style',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Card padding',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <p className="text-gray-600">This is a default card with some content.</p>,
  },
}

export const Hover: Story = {
  args: {
    variant: 'hover',
    children: <p className="text-gray-600">Hover over this card to see the effect.</p>,
  },
}

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    children: <p className="text-gray-600">Click or hover to see interactive effects.</p>,
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">Card Header</h3>
      </div>
    ),
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: <p className="text-sm text-gray-600">Small padding card.</p>,
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: <p className="text-gray-600">Large padding card with more space.</p>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card variant="default">
        <h3 className="mb-2 font-semibold text-gray-900">Default</h3>
        <p className="text-sm text-gray-600">Basic card with shadow</p>
      </Card>
      <Card variant="hover">
        <h3 className="mb-2 font-semibold text-gray-900">Hover</h3>
        <p className="text-sm text-gray-600">Hover to see effect</p>
      </Card>
      <Card variant="interactive">
        <h3 className="mb-2 font-semibold text-gray-900">Interactive</h3>
        <p className="text-sm text-gray-600">Click or hover</p>
      </Card>
    </div>
  ),
}

export const WebtoonCard: Story = {
  render: () => (
    <Card variant="interactive" padding="none" className="max-w-xs overflow-hidden">
      <div className="from-primary-400 to-primary-600 aspect-[3/4] bg-gradient-to-br" />
      <div className="p-4">
        <h3 className="truncate font-semibold text-gray-900">Shadow Knight</h3>
        <p className="text-sm text-gray-500">Action, Fantasy</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <span>1.2M views</span>
        </div>
      </div>
    </Card>
  ),
}
