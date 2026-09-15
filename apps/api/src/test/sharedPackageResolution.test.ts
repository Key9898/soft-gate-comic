import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The API runs as a plain Node ESM process, and Node's resolver requires the
 * file extension on a relative import. `@softgate/shared` is consumed straight
 * from source, so an extensionless import there is not a style question — it
 * stops `pnpm start` booting at all, while `pnpm dev` keeps working because
 * tsx resolves it. See #27.
 */
const SHARED_SRC = join(process.cwd(), '..', '..', 'packages', 'shared', 'src')
const SHARED_TSCONFIG = join(process.cwd(), '..', '..', 'packages', 'shared', 'tsconfig.json')

// `from './data'` — relative, no extension. `from './data.js'` is fine.
const EXTENSIONLESS = /\bfrom\s+'(\.\.?\/[^']*?)'/g

function offendingImports(): string[] {
  const offenders: string[] = []
  for (const file of readdirSync(SHARED_SRC)) {
    if (!file.endsWith('.ts')) continue
    const source = readFileSync(join(SHARED_SRC, file), 'utf8')
    for (const [, specifier] of source.matchAll(EXTENSIONLESS)) {
      if (!specifier!.endsWith('.js')) offenders.push(`${file}: ${specifier}`)
    }
  }
  return offenders
}

describe('@softgate/shared stays resolvable by plain Node ESM', () => {
  it('has no extensionless relative imports', () => {
    expect(offendingImports()).toEqual([])
  })

  it('compiles under NodeNext so the compiler keeps enforcing it', () => {
    // "bundler" lets extensionless imports through and emits them unchanged,
    // so dist has the same defect as src.
    const tsconfig = JSON.parse(readFileSync(SHARED_TSCONFIG, 'utf8')) as {
      compilerOptions?: { moduleResolution?: string }
    }
    expect(tsconfig.compilerOptions?.moduleResolution).toBe('NodeNext')
  })
})
