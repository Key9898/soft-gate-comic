self.addEventListener('push', (event) => {
  let payload = { title: 'SoftGate Comic', body: '', href: '/' }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch {
    payload.body = event.data ? event.data.text() : ''
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'SoftGate Comic', {
      body: payload.body || '',
      data: { href: payload.href },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const href =
    event.notification.data && typeof event.notification.data.href === 'string'
      ? event.notification.data.href
      : '/'
  const path = href.startsWith('http') ? href : href.startsWith('/') ? href : `/${href}`
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client && path.startsWith('/')) client.navigate(path)
          return
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(path)
      return undefined
    })
  )
})
