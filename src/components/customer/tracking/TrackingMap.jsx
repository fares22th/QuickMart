import { APIProvider, Map } from '@vis.gl/react-google-maps'

export default function TrackingMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY

  return (
    <div className="rounded-2xl overflow-hidden h-64 my-4">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
          defaultZoom={14}
          gestureHandling="cooperative"
          disableDefaultUI
        />
      </APIProvider>
    </div>
  )
}
