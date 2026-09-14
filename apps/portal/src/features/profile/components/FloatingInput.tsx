import Input, { type InputProps } from '../../../components/Input'

export type FloatingInputProps = Omit<InputProps, 'variant'>

/**
 * Kept as a named wrapper so the profile call sites stay readable; the floating
 * label is now a variant of the shared `Input`, not a second implementation.
 */
export const FloatingInput = (props: FloatingInputProps) => <Input variant="floating" {...props} />

export default FloatingInput
