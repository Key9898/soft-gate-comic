import type { Meta, StoryObj } from '@storybook/react'
import LanguageSwitcher from './LanguageSwitcher'

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'UI/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

export const Default: Story = {
  args: {},
}

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white p-4">
        <span className="text-primary-600 text-xl font-bold">Soft-Gate Comic</span>
        <Story />
      </div>
    ),
  ],
}
