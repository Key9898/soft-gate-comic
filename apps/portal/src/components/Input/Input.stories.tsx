import type { Meta, StoryObj } from '@storybook/react'
import { Mail, Search } from 'lucide-react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    hint: {
      control: 'text',
      description: 'Hint text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
    error: 'Please enter a valid email address',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    hint: 'Username must be at least 3 characters',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
  },
}

export const WithLeftIcon: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
    leftIcon: <Mail className="h-5 w-5" />,
  },
}

export const SearchInput: Story = {
  args: {
    placeholder: 'Search webtoons...',
    leftIcon: <Search className="h-5 w-5" />,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input label="Default" placeholder="Default input" />
      <Input
        label="With Left Icon"
        placeholder="Search..."
        leftIcon={<Search className="h-5 w-5" />}
      />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="With Error" placeholder="Invalid input" error="This field is required" />
      <Input label="With Hint" placeholder="Enter username" hint="Must be at least 3 characters" />
      <Input label="Disabled" placeholder="Disabled" disabled />
    </div>
  ),
}
