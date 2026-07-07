import { useEffect, useRef } from 'react'
import { socket } from '@/lib/socket'

// Use Capacitor Geolocation when running as native app, fall back to browser API
async function getGeoPlugin() {
  try {
    const { Geolocation } = await import('@capacitor/geolocation')
    return Geolocation
  } catch {
    return null
  }
}

export function useLocationBroadcast(orderId) {
  const watchRef    = useRef(null)
  const nativeRef   = useRef(false)

  useEffect(() => {
    if (!orderId) return

    if (!socket.connected) socket.connect()

    let cancelled = false

    const startWatch = async () => {
      const Geo = await getGeoPlugin()

      // ── Capacitor native (Android/iOS) ──────────────────
      if (Geo) {
        try {
          await Geo.requestPermissions()
          nativeRef.current = true
          watchRef.current = await Geo.watchPosition(
            { enableHighAccuracy: true, timeout: 15000 },
            (pos, err) => {
              if (err || !pos) return
              if (!socket.connected) socket.connect()
              socket.emit('driver:location', {
                orderId,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              })
            }
          )
          return
        } catch (e) {
          console.warn('Capacitor GPS error:', e)
        }
      }

      // ── Browser fallback ─────────────────────────────────
      if (!navigator.geolocation) return
      nativeRef.current = false
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          if (cancelled) return
          socket.emit('driver:location', {
            orderId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => console.warn('GPS:', err.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 4000 }
      )
    }

    startWatch()

    return () => {
      cancelled = true
      if (watchRef.current === null) return

      if (nativeRef.current) {
        getGeoPlugin().then(Geo => {
          if (Geo && watchRef.current != null) {
            Geo.clearWatch({ id: watchRef.current })
          }
        })
      } else {
        navigator.geolocation.clearWatch(watchRef.current)
      }
      watchRef.current = null
    }
  }, [orderId])
}
