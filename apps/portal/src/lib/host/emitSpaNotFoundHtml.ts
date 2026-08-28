import { copyFileSync, existsSync, renameSync } from 'node:fs'
import path from 'node:path'

export const SSR_TEMPLATE_FILENAME = 'template.html'

export const emitSpaNotFoundHtml = (distDir: string): void => {
  const indexPath = path.join(distDir, 'index.html')
  const notFoundPath = path.join(distDir, '404.html')
  if (!existsSync(indexPath)) {
    throw new Error('dist/index.html missing')
  }
  copyFileSync(indexPath, notFoundPath)
}

export const prepareSsrClientDist = (distDir: string): void => {
  emitSpaNotFoundHtml(distDir)
  renameSync(path.join(distDir, 'index.html'), path.join(distDir, SSR_TEMPLATE_FILENAME))
}
