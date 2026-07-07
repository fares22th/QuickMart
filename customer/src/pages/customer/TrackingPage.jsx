import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Phone, Clock, Navigation, Wifi } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import { useSingleOrderRealtime } from '@/hooks/useOrderRealtime'
import { socket } from '@/lib/socket'
import { useAuthStore } from '@/store/useAuthStore'

// Leaflet CSS must come before L is used
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet default marker icon path broken by bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom icons
const DRIVER_ICON = L.divIcon({
  className: '',
  html: `<div style="
    width:48px;height:48px;border-radius:50%;
    background:linear-gradient(135deg,#00C896,#059669);
    display:flex;align-items:center;justify-content:center;
    font-size:22px;box-shadow:0 4px 16px rgba(0,200,150,0.5);
    border:3px solid #fff;
  ">🚴</div>`,
  iconSize:   [48, 48],
  iconAnchor: [24, 24],
})

const DEST_ICON = L.divIcon({
  className: '',
  html: `<div style="
    width:44px;height:44px;border-radius:50%;
    background:linear-gradient(135deg,#00C896,#065F46);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;box-shadow:0 4px 14px rgba(0,200,150,0.45);
    border:3px solid #fff;
  ">🏠</div>`,
  iconSize:   [44, 44],
  iconAnchor: [22, 44],
})

// Geocode an address string via Nominatim (free OpenStreetMap)
async function geocode(addressText) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressText)}&format=json&limit=1`
    const res  = await fetch(url, { headers: { 'Accept-Language': 'ar' } })
    const data = await res.json()
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

// ETA via OSRM (free routing engine)
async function fetchETA(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`
    const res  = await fetch(url)
    const data = await res.json()
    const route = data.routes?.[0]
    if (!route) return null
    return {
      minutes:  Math.ceil(route.duration / 60),
      km:       (route.distance / 1000).toFixed(1),
    }
  } catch {}
  return null
}

export default function TrackingPage() {
  const { orderId }   = useParams()
  const { user }      = useAuthStore()
  const { data: order } = useOrder(orderId)
  useSingleOrderRealtime(orderId)

  const mapRef        = useRef(null)   // DOM element
  const leafletRef    = useRef(null)   // L.Map instance
  const driverMarker  = useRef(null)
  const destMarker    = useRef(null)

  const [driverPos,   setDriverPos]   = useState(null)   // { lat, lng }
  const [destPos,     setDestPos]     = useState(null)   // { lat, lng }
  const [eta,         setETA]         = useState(null)   // { minutes, km }
  const [liveSignal,  setLiveSignal]  = useState(false)  // pulsing indicator

  // ── Initialise Leaflet map once ──────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    leafletRef.current = L.map(mapRef.current, {
      center: [24.7136, 46.6753],  // Riyadh default
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(leafletRef.current)

    // Attribution small bottom-right
    L.control.attribution({ prefix: '© OpenStreetMap' }).addTo(leafletRef.current)

    return () => {
      leafletRef.current?.remove()
      leafletRef.current = null
    }
  }, [])

  // ── Geocode customer delivery address ────────────────────
  useEffect(() => {
    if (!order?.address) return
    const { city, district, street } = order.address
    const text = [street, district, city].filter(Boolean).join(', ')
    geocode(text).then(pos => { if (pos) setDestPos(pos) })
  }, [order?.address])

  // ── Destination marker ───────────────────────────────────
  useEffect(() => {
    const map = leafletRef.current
    if (!map || !destPos) return

    if (destMarker.current) {
      destMarker.current.setLatLng([destPos.lat, destPos.lng])
    } else {
      destMarker.current = L.marker([destPos.lat, destPos.lng], { icon: DEST_ICON })
        .addTo(map)
        .bindPopup(`<b>موقع التسليم</b>`, { closeButton: false })
    }

    // If no driver yet, center on destination
    if (!driverPos) {
      map.setView([destPos.lat, destPos.lng], 15)
    }
  }, [destPos, driverPos])

  // ── Driver marker (updates in real-time) ─────────────────
  const updateDriverOnMap = useCallback((pos) => {
    const map = leafletRef.current
    if (!map) return

    if (driverMarker.current) {
      driverMarker.current.setLatLng([pos.lat, pos.lng])
    } else {
      driverMarker.current = L.marker([pos.lat, pos.lng], { icon: DRIVER_ICON })
        .addTo(map)
        .bindPopup(order?.driver?.user?.name ?? 'المندوب', { closeButton: false })
    }

    // Auto-follow driver — smooth pan
    map.panTo([pos.lat, pos.lng], { animate: true, duration: 0.8 })

    // Fit both markers if destination known
    if (destPos) {
      map.fitBounds(
        L.latLngBounds([[pos.lat, pos.lng], [destPos.lat, destPos.lng]]),
        { padding: [60, 60], maxZoom: 16, animate: true }
      )
    }
  }, [destPos, order?.driver?.user?.name])

  useEffect(() => {
    if (!driverPos) return
    updateDriverOnMap(driverPos)
  }, [driverPos, updateDriverOnMap])

  // ── ETA refresh whenever driver moves ───────────────────
  useEffect(() => {
    if (!driverPos || !destPos) return
    fetchETA(driverPos, destPos).then(e => { if (e) setETA(e) })
  }, [driverPos?.lat, driverPos?.lng, destPos?.lat, destPos?.lng])  // eslint-disable-line

  // ── Socket: receive driver GPS location ──────────────────
  useEffect(() => {
    if (!user || !orderId) return
    if (!socket.connected) socket.connect()

    const onLocation = ({ lat, lng }) => {
      setDriverPos({ lat, lng })
      setLiveSignal(true)
      setTimeout(() => setLiveSignal(false), 2000)
    }

    socket.on('driver:location', onLocation)
    return () => { socket.off('driver:location', onLocation) }
  }, [user, orderId])

  const driver    = order?.driver?.user
  const orderNum  = String(orderId ?? '').slice(-6).toUpperCase()

  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 100 }} dir="rtl">

      {/* ── Map full-screen ── */}
      <div ref={mapRef} className="flex-1 w-full" style={{ zIndex: 0 }} />

      {/* ── Top overlay: back + order number + live signal ── */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)', zIndex: 10 }}
      >
        <Link
          to={`/order/${orderId}`}
          className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </Link>

        <div>
          <p className="text-white font-bold text-sm">تتبع الطلب #{orderNum}</p>
          <p className="text-white/60 text-xs">
            {order?.store?.storeName ?? 'جاري التحميل...'}
          </p>
        </div>

        {/* Live GPS signal indicator */}
        <div className="mr-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm"
          style={{ background: driverPos ? 'rgba(0,200,150,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid ${driverPos ? 'rgba(0,200,150,0.5)' : 'rgba(255,255,255,0.2)'}` }}
        >
          <div
            className={`w-2 h-2 rounded-full ${liveSignal ? 'animate-ping' : ''}`}
            style={{ background: driverPos ? '#00C896' : '#9CA3AF' }}
          />
          <Wifi className="w-3 h-3" style={{ color: driverPos ? '#00C896' : '#9CA3AF' }} />
          <span className="text-xs font-bold" style={{ color: driverPos ? '#00C896' : '#9CA3AF' }}>
            {driverPos ? 'مباشر' : 'انتظار...'}
          </span>
        </div>
      </div>

      {/* ── ETA pill (center-top when we have data) ── */}
      {eta && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg"
          style={{ top: '5.5rem', zIndex: 10, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,200,150,0.4)' }}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-black text-sm">{eta.minutes} دقيقة</span>
          <span className="text-white/40 text-xs">·</span>
          <span className="text-white/60 text-xs">{eta.km} كم</span>
        </div>
      )}

      {/* ── Bottom panel: driver info + contact ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{ zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 60%, transparent 100%)' }}
      >
        {driver ? (
          <div
            className="rounded-2xl p-4 mb-3"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,200,150,0.25)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-3">
              {/* Driver avatar */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'rgba(0,200,150,0.2)', border: '1.5px solid rgba(0,200,150,0.4)' }}
              >
                🚴
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-base leading-tight">{driver.name}</p>
                <p className="text-emerald-400 text-xs mt-0.5 font-medium">
                  {order?.status === 'shipped' ? '🟢 في الطريق إليك' : '🟡 في طريقه للمتجر'}
                </p>
                {driver.phone && (
                  <p className="text-white/40 text-xs font-mono mt-0.5">{driver.phone}</p>
                )}
              </div>

              {/* Contact buttons */}
              {driver.phone && (
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`tel:${driver.phone}`}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'linear-gradient(135deg,#00C896,#059669)', boxShadow: '0 4px 14px rgba(0,200,150,0.5)' }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={`https://wa.me/${driver.phone.replace(/^0/, '966')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-4 mb-3 text-center"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
          >
            <p className="text-white/60 text-sm">لم يتم تعيين مندوب بعد</p>
          </div>
        )}

        {/* "Center on driver" button */}
        {driverPos && (
          <button
            onClick={() => {
              const map = leafletRef.current
              if (map && driverPos) map.setView([driverPos.lat, driverPos.lng], 16, { animate: true })
            }}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95"
            style={{ background: 'rgba(0,200,150,0.15)', color: '#00C896', border: '1px solid rgba(0,200,150,0.3)' }}
          >
            <Navigation className="w-4 h-4" />
            تتبع موقع المندوب
          </button>
        )}

        {!driverPos && (
          <div className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            في انتظار إشارة GPS من المندوب...
          </div>
        )}
      </div>

    </div>
  )
}
