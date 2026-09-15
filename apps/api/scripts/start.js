#!/usr/bin/env node
// Sets UV_THREADPOOL_SIZE before the server starts, then hands over to it.
//
// libuv reads the pool size once, when the pool is first used, so setting it
// from inside the server would be a coin flip. Spawning a child with the value
// already in its environment is the only way to be sure it took effect.
//
// An explicit UV_THREADPOOL_SIZE is left untouched — see src/threadpool.ts.
import { spawn } from 'node:child_process'
import { cpus } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { resolveThreadpoolSize } from '../dist/threadpool.js'

const here = dirname(fileURLToPath(import.meta.url))
const server = join(here, '..', 'dist', 'index.js')

const size = resolveThreadpoolSize({
  current: process.env.UV_THREADPOOL_SIZE,
  cpus: cpus().length,
})

const env = { ...process.env }
if (size !== null) env.UV_THREADPOOL_SIZE = String(size)

const child = spawn(process.execPath, [server, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
})

// Forward signals so the container stop path still reaches the server.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
