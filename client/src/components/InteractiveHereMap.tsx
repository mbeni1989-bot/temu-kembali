import { useEffect, useRef, useState } from "react";
import { hereReverseGeocode } from "@/lib/hereGeocode";
import { toast } from "sonner";

interface InteractiveHereMapProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

declare global {
  interface Window {
    H: any;
  }
}

export default function InteractiveHereMap({
  center,
  zoom = 16,
  onLocationChange,
  className = "",
}: InteractiveHereMapProps) {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  
  // Callback ref with logging
  const mapContainerRef = (element: HTMLDivElement | null) => {
    console.log('[HERE] Callback ref called', { element: !!element });
    setMapContainer(element);
  };
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [behavior, setBehavior] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    console.log('[HERE] useEffect triggered', { hasMapContainer: !!mapContainer, hasMap: !!map });
    if (!mapContainer || map) {
      console.log('[HERE] Skipping initialization', { reason: !mapContainer ? 'no mapContainer' : 'map exists' });
      return;
    }

    // API key is now handled by backend proxy - no client-side key needed!
    // Map initialization uses HERE Maps JavaScript API loaded from CDN

    // Wait for HERE Maps API to load
    if (typeof window.H === "undefined") {
      console.error("[HERE] Maps API not loaded");
      setError("Failed to load map. Please refresh the page.");
      setLoading(false);
      return;
    }

    // Add small delay to ensure container is fully rendered and has dimensions
    const timeoutId = setTimeout(() => {
      try {
        const H = window.H;
        const platform = new H.service.Platform({ apikey: apiKey });
        const defaultLayers = platform.createDefaultLayers();

        const newMap = new H.Map(
          mapContainer,
          defaultLayers.vector.normal.map,
          {
            center: { lat: center[1], lng: center[0] },
            zoom: zoom,
            pixelRatio: window.devicePixelRatio || 1,
          }
        );

        // Make map interactive
        const mapEvents = new H.mapevents.MapEvents(newMap);
        const mapBehavior = new H.mapevents.Behavior(mapEvents);

        // Add UI controls
        H.ui.UI.createDefault(newMap, defaultLayers);

        // Handle window resize
        const handleResize = () => newMap.getViewPort().resize();
        window.addEventListener("resize", handleResize);

        setMap(newMap);
        setBehavior(mapBehavior);
        setLoading(false);
      } catch (err) {
        console.error("[HERE] Map initialization error:", err);
        setError("Failed to initialize map");
        setLoading(false);
      }
    }, 100); // 100ms delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mapContainer, map]);

  // Add click/tap to place marker (better for mobile UX)
  useEffect(() => {
    if (!map || !behavior) return;

    const H = window.H;

    const handleMapTap = async (ev: any) => {
      // Get coordinates from tap/click position
      const coord = map.screenToGeo(
        ev.currentPointer.viewportX,
        ev.currentPointer.viewportY
      );
      
      const lat = coord.lat;
      const lng = coord.lng;
      
      console.log("[HERE] Map tapped at:", { lat, lng });

      // Move marker to new position
      if (marker) {
        marker.setGeometry({ lat, lng });
        map.setCenter({ lat, lng });
      }

      // Reverse geocode to get address
      if (onLocationChange) {
        try {
          toast.loading("Getting address...", { id: "reverse-geocode" });
          
          const result = await hereReverseGeocode(lng, lat);
          
          if (result) {
            const address = result.title;
            onLocationChange({ lat, lng, address });
            
            toast.success("Location updated!", { id: "reverse-geocode" });
            console.log("[HERE] Reverse geocode success:", address);
          } else {
            // Fallback to coordinates if reverse geocoding fails
            const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onLocationChange({ lat, lng, address: coordsAddress });
            
            toast.warning("Could not get address for this location", { 
              id: "reverse-geocode",
              description: "Using coordinates instead" 
            });
            console.warn("[HERE] Reverse geocode failed, using coordinates");
          }
        } catch (error) {
          console.error("[HERE] Reverse geocode error:", error);
          
          // Fallback to coordinates
          const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationChange({ lat, lng, address: coordsAddress });
          
          toast.error("Could not get address for this location", { 
            id: "reverse-geocode" 
          });
        }
      }
    };

    // Add tap listener
    map.addEventListener("tap", handleMapTap, false);

    // Cleanup
    return () => {
      map.removeEventListener("tap", handleMapTap);
    };
  }, [map, behavior, marker, onLocationChange]);

  // Add/update marker
  useEffect(() => {
    if (!map || !behavior) return;

    const H = window.H;

    // Remove old marker if exists
    if (marker) {
      try {
        map.removeObject(marker);
      } catch (err) {
        // Marker might not be on map, ignore error
        console.log('[HERE] Could not remove old marker (might not be on map)');
      }
    }

    // Create new marker with volatility for smooth dragging
    const newMarker = new H.map.Marker(
      { lat: center[1], lng: center[0] },
      {
        volatility: true, // Important for smooth dragging!
      }
    );

    // Enable dragging
    newMarker.draggable = true;

    // Add marker to map
    map.addObject(newMarker);
    setMarker(newMarker);

    // Center map on marker
    map.setCenter({ lat: center[1], lng: center[0] });

    // Setup drag event listeners
    const handleDragStart = (ev: any) => {
      const target = ev.target;
      const pointer = ev.currentPointer;
      
      if (target instanceof H.map.Marker) {
        // Calculate offset for smooth dragging
        const targetPosition = map.geoToScreen(target.getGeometry());
        target.offset = new H.math.Point(
          pointer.viewportX - targetPosition.x,
          pointer.viewportY - targetPosition.y
        );
        
        // Disable map panning while dragging marker
        behavior.disable();
        
        console.log("[HERE] Marker drag started");
      }
    };

    const handleDrag = (ev: any) => {
      const target = ev.target;
      const pointer = ev.currentPointer;
      
      if (target instanceof H.map.Marker) {
        // Update marker position during drag
        target.setGeometry(
          map.screenToGeo(
            pointer.viewportX - target.offset.x,
            pointer.viewportY - target.offset.y
          )
        );
      }
    };

    const handleDragEnd = async (ev: any) => {
      const target = ev.target;
      
      if (target instanceof H.map.Marker) {
        // Re-enable map panning
        behavior.enable();
        
        const geometry = target.getGeometry();
        const lat = geometry.lat;
        const lng = geometry.lng;
        
        console.log("[HERE] Marker drag ended at:", { lat, lng });

        // Reverse geocode to get address
        if (onLocationChange) {
          try {
            toast.loading("Getting address...", { id: "reverse-geocode" });
            
            const result = await hereReverseGeocode(lng, lat);
            
            if (result) {
              const address = result.title;
              onLocationChange({ lat, lng, address });
              
              toast.success("Location updated!", { id: "reverse-geocode" });
              console.log("[HERE] Reverse geocode success:", address);
            } else {
              // Fallback to coordinates if reverse geocoding fails
              const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              onLocationChange({ lat, lng, address: coordsAddress });
              
              toast.warning("Could not get address for this location", { 
                id: "reverse-geocode",
                description: "Using coordinates instead" 
              });
              console.warn("[HERE] Reverse geocode failed, using coordinates");
            }
          } catch (error) {
            console.error("[HERE] Reverse geocode error:", error);
            
            // Fallback to coordinates
            const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onLocationChange({ lat, lng, address: coordsAddress });
            
            toast.error("Could not get address for this location", { 
              id: "reverse-geocode" 
            });
          }
        }
      }
    };

    // Add event listeners to map (not marker!)
    map.addEventListener("dragstart", handleDragStart, false);
    map.addEventListener("drag", handleDrag, false);
    map.addEventListener("dragend", handleDragEnd, false);

    // Cleanup
    return () => {
      map.removeEventListener("dragstart", handleDragStart);
      map.removeEventListener("drag", handleDrag);
      map.removeEventListener("dragend", handleDragEnd);
      
      if (marker) {
        try {
          map.removeObject(marker);
        } catch (err) {
          // Marker might not be on map, ignore error
          console.log('[HERE] Could not remove marker in cleanup (might not be on map)');
        }
      }
    };
  }, [map, behavior, center, onLocationChange]);

  // Always render map container (hidden during loading) so ref callback is called
  // Use visibility:hidden instead of display:none to allow WebGL context initialization
  if (loading) {
    return (
      <div className="space-y-2">
        <div ref={mapContainerRef} className={className} style={{ visibility: 'hidden', position: 'absolute' }} />
        <div className={`flex items-center justify-center bg-muted ${className}`}>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={mapContainerRef} className={className} />
      <div className="text-xs text-muted-foreground text-center">
        💡 Click/tap on the map to place marker, or drag to adjust
      </div>
    </div>
  );
}
