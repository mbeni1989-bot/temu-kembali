import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token dari env (set VITE_MAPBOX_TOKEN di Railway / .env)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

interface InteractiveMapboxProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void;
}

export default function InteractiveMapbox({
  center,
  zoom = 13,
  className = "w-full h-96",
  onLocationChange,
}: InteractiveMapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

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

    // Create draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: "#0EA5E9",
    })
      .setLngLat(center)
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on("dragend", async () => {
      if (marker.current && onLocationChange) {
        const lngLat = marker.current.getLngLat();
        
        // Reverse geocoding using Mapbox Geocoding API
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          
          const address = data.features[0]?.place_name || `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`;
          
          onLocationChange({
            lat: lngLat.lat,
            lng: lngLat.lng,
            address: address,
          });
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          onLocationChange({
            lat: lngLat.lat,
            lng: lngLat.lng,
            address: `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`,
          });
        }
      }
    });

    // Handle map click to move marker
    map.current.on("click", async (e) => {
      if (marker.current && onLocationChange) {
        marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        
        // Reverse geocoding
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          
          const address = data.features[0]?.place_name || `${e.lngLat.lat.toFixed(6)}, ${e.lngLat.lng.toFixed(6)}`;
          
          onLocationChange({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
            address: address,
          });
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          onLocationChange({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
            address: `${e.lngLat.lat.toFixed(6)}, ${e.lngLat.lng.toFixed(6)}`,
          });
        }
      }
    });

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position when center changes
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat(center);
      map.current.flyTo({ center: center, zoom: zoom });
    }
  }, [center, zoom]);

  return <div ref={mapContainer} className={className} />;
}

