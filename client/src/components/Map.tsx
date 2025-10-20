import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description?: string;
  }>;
  className?: string;
  rotating?: boolean;
}

function RotatingMap({ rotating }: { rotating: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!rotating) return;

    let angle = 0;
    const interval = setInterval(() => {
      angle = (angle + 1) % 360;
      // Rotate the map by panning in a circle
      const center = map.getCenter();
      const radius = 0.001;
      const rad = (angle * Math.PI) / 180;
      const newLat = center.lat + radius * Math.cos(rad);
      const newLng = center.lng + radius * Math.sin(rad);
      map.panTo([newLat, newLng], { animate: true, duration: 0.05 });
    }, 50);

    return () => clearInterval(interval);
  }, [rotating, map]);

  return null;
}

export default function Map({
  center = [0, 0],
  zoom = 13,
  markers = [],
  className = "h-96 w-full rounded-xl",
  rotating = false,
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{marker.title}</h3>
              {marker.description && (
                <p className="text-sm text-muted-foreground">{marker.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {rotating && <RotatingMap rotating={rotating} />}
    </MapContainer>
  );
}

