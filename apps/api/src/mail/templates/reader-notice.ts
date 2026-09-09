function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function portalHref(clientUrl: string, href: string | undefined): string | undefined {
  if (!href) return undefined
  const trimmed = href.trim()
  if (!trimmed) return undefined
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!trimmed.startsWith('/')) return undefined
  const origin = clientUrl.replace(/\/+$/, '')
  return `${origin}${trimmed}`
}

export function readerNoticeEmail(input: { clientUrl: string; message: string; href?: string }) {
  const message = escapeHtml(input.message)
  const url = portalHref(input.clientUrl, input.href)
  const linkHtml = url ? `<p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>` : ''
  const linkText = url ? `\n${url}\n` : '\n'
  return {
    subject: input.message,
    html: `<!doctype html>
<html lang="en">
  <body>
    <p>${message}</p>
    ${linkHtml}
    <p>SoftGate Comic</p>
  </body>
</html>`,
    text: `${input.message}${linkText}SoftGate Comic`,
  }
}
