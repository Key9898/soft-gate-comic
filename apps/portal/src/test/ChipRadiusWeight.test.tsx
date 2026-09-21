import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Chip, { ChipLink } from '../components/Chip'
import { buttonClasses, type ButtonSize } from '../components/Button/buttonClasses'

const themeBlock = () => {
  const css = readFileSync(path.resolve(__dirname, '../index.css'), 'utf8')
  const start = css.indexOf('@theme {')
  expect(start).toBeGreaterThan(-1)
  return css.slice(start, css.indexOf('\n}', start))
}

/**
 * Issue #36. The radius scale was flat — buttons, inputs, chips and cards all sat at
 * 16px, so nothing in the UI told you a chip was a lighter control than a button. The
 * redesign adds a 12px step below `rounded-2xl` that only chips use. Chips also shipped
 * `text-xs font-bold`, which `wiki/conventions/type-weight-scale.md` bans outside the
 * cover-overlay exception, and a chip is not drawn on artwork.
 */
describe('chip radius step', () => {
  it('declares radius/chip as a theme token at 12px', () => {
    expect(themeBlock()).toMatch(/--radius-chip:\s*0\.75rem/)
  })

  it('rounds chips at the new step, not the 16px button radius', () => {
    render(
      <Chip selected={false} onClick={() => {}}>
        Romance
      </Chip>
    )
    const chip = screen.getByRole('button', { name: 'Romance' })
    expect(chip.className).toContain('rounded-chip')
    expect(chip.className).not.toContain('rounded-2xl')
  })

  it('gives a navigating chip the same radius as a pressable one', () => {
    render(
      <MemoryRouter>
        <ChipLink to="/categories/action" selected={false}>
          Action
        </ChipLink>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Action' }).className).toContain('rounded-chip')
  })

  it('leaves buttons on the 16px radius so the two stay distinguishable', () => {
    for (const size of ['sm', 'md', 'lg'] satisfies ButtonSize[]) {
      expect(buttonClasses({ size })).toContain('rounded-2xl')
    }
  })
})

describe('chip type weight', () => {
  it('drops font-bold, which the weight scale reserves for headings and cover overlays', () => {
    render(
      <Chip selected={false} onClick={() => {}}>
        Ongoing
      </Chip>
    )
    const chip = screen.getByRole('button', { name: 'Ongoing' })
    expect(chip.className).toContain('text-xs')
    expect(chip.className).toContain('font-semibold')
    expect(chip.className).not.toContain('font-bold')
  })
})
