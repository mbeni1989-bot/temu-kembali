import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

interface InteractiveMapProps {
  center: [number, number];
  zoom?: number;
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  className?: string;
}

function LocationMarker({ onLocationChange }: { onLocationChange?: (lat: number, lng: number, address: string) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const markerRef = useRef<L.Marker>(null);

  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());
      
      // Reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          if (onLocationChange) {
            onLocationChange(e.latlng.lat, e.latlng.lng, data.display_name || "");
          }
        })
        .catch(err => {
          console.error("Error getting address:", err);
          if (onLocationChange) {
            onLocationChange(e.latlng.lat, e.latlng.lng, "");
          }
        });
    },
  });

  useEffect(() => {
    if (position && markerRef.current) {
      const marker = markerRef.current;
      
      marker.on('dragend', function() {
        const newPos = marker.getLatLng();
        const newPosition: [number, number] = [newPos.lat, newPos.lng];
        setPosition(newPosition);
        
        // Reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`)
          .then(res => res.json())
          .then(data => {
            if (onLocationChange) {
              onLocationChange(newPos.lat, newPos.lng, data.display_name || "");
            }
          })
          .catch(err => {
            console.error("Error getting address:", err);
            if (onLocationChange) {
              onLocationChange(newPos.lat, newPos.lng, "");
            }
          });
      });
    }
  }, [position, onLocationChange]);

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      ref={markerRef}
    />
  );
}

function SetViewOnClick({ coords }: { coords: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);

  return null;
}

export default function InteractiveMap({
  center,
  zoom = 13,
  onLocationChange,
  className = "h-96 w-full rounded-xl",
}: InteractiveMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} />
      <SetViewOnClick coords={center} />
    </MapContainer>
  );
}

