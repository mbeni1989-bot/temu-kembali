import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token dari env (set VITE_MAPBOX_TOKEN di Railway / .env)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

interface MapboxMapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
  markers?: Array<{
    lng: number;
    lat: number;
    title?: string;
    description?: string;
  }>;
}

export default function MapboxMap({
  center = [106.8456, -6.2088], // Default: Jakarta
  zoom = 10,
  className = "w-full h-96",
  markers = [],
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers
    markers.forEach((marker) => {
      if (map.current) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-semibold">${marker.title || "Location"}</h3>
            ${marker.description ? `<p class="text-sm text-gray-600">${marker.description}</p>` : ""}
          </div>`
        );

        new mapboxgl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, markers]);

  return <div ref={mapContainer} className={className} />;
}

