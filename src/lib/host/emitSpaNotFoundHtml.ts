import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'

export const emitSpaNotFoundHtml = (distDir: string): void => {
  const indexPath = path.join(distDir, 'index.html')
  const notFoundPath = path.join(distDir, '404.html')
  if (!existsSync(indexPath)) {
    throw new Error('dist/index.html missing')
  }
  copyFileSync(indexPath, notFoundPath)
}
