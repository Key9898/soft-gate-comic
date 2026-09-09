import { authFetch } from '../api/authFetch'
import { isMockApi } from '../api/isMockApi'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
  return output
}

export function registerPushWorker() {
  if (isMockApi()) return
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  void navigator.serviceWorker.register('/sw.js')
}

export async function enableLockScreenPush(): Promise<'ok' | 'unavailable' | 'denied'> {
  if (isMockApi()) return 'unavailable'
  if (
    typeof navigator === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window)
  ) {
    return 'unavailable'
  }
  if (!window.isSecureContext) return 'unavailable'
  try {
    const { publicKey } = await authFetch<{ publicKey: string }>('/api/notifications/push/vapid')
    const registration = await navigator.serviceWorker.register('/sw.js')
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return 'denied'
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
    const json = subscription.toJSON()
    const endpoint = json.endpoint
    const p256dh = json.keys?.p256dh
    const auth = json.keys?.auth
    if (!endpoint || !p256dh || !auth) return 'unavailable'
    await authFetch<{ ok: true }>('/api/notifications/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint, keys: { p256dh, auth } }),
    })
    return 'ok'
  } catch {
    return 'unavailable'
  }
}
