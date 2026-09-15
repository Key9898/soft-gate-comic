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
 * This directly sets the login ceiling. Password hashing uses native bcrypt,
 * which runs on this pool, so the pool size is how many logins can hash at
 * once — measured in #25, ten concurrent cost-12 hashes took 699ms at the
 * default of 4 and 295ms at 12.
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
