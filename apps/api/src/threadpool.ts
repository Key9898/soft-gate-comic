/**
 * libuv runs a fixed pool of threads for the work Node cannot do on the event
 * loop — fs, dns, zlib, and the threadpool-backed `node:crypto` primitives. The
 * default is 4 regardless of how many cores the host has, so four concurrent
 * threadpool operations is the ceiling before the rest queue behind them.
 *
 * The size is read once, when the pool is first used, so it has to be in the
 * environment before the server process starts. That is why this is a launcher
 * rather than a line inside the server.
 *
 * Note what this does and does not buy today: password hashing currently uses
 * `bcryptjs`, which is pure JavaScript and never touches the threadpool, so
 * this does nothing for login latency until #25 is resolved. It helps fs and
 * dns concurrency now, and it is the prerequisite for #25's fix to scale at
 * all — measured there, raising the pool from 4 to 16 cut ten concurrent
 * threadpool hashes from 627ms to 283ms.
 */

/** libuv's own default. Never go below it — that would be a regression. */
export const THREADPOOL_MIN = 4

/**
 * Threads past this stop helping: they are bounded by cores, and each one costs
 * a stack. A large shared host should not hand us a 96-thread pool by accident.
 */
export const THREADPOOL_MAX = 16

export function resolveThreadpoolSize(input: {
  current: string | undefined
  cpus: number
}): number | null {
  // An operator who set this deliberately knows the box better than we do.
  const explicit = Number(input.current)
  if (input.current && Number.isInteger(explicit) && explicit > 0) return null

  if (!Number.isFinite(input.cpus) || input.cpus <= 0) return THREADPOOL_MIN
  return Math.min(THREADPOOL_MAX, Math.max(THREADPOOL_MIN, Math.floor(input.cpus)))
}
