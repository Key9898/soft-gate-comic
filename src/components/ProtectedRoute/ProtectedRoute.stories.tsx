import type { Meta, StoryObj } from '@storybook/react'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from '../../features/auth/useAuth'

const meta = {
  title: 'Components/ProtectedRoute',
  component: ProtectedRoute,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ProtectedRoute>

export default meta
type Story = StoryObj<typeof meta>

const ProtectedContent = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Protected Content</h1>
      <p className="text-gray-600">This content is only visible to authenticated users.</p>
    </div>
  </div>
)

export const Default: Story = {
  args: {
    children: <ProtectedContent />,
  },
}

export const WithLoadingState: Story = {
  args: {
    children: <ProtectedContent />,
  },
}
