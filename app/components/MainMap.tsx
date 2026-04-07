import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapboxMapProps {
  onMapClick: (lng: number, lat: number) => void;
  selectedCoords?: [number, number] | null;
}

export function MainMap({ onMapClick, selectedCoords }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [20, 20],
      zoom: 2,
      projection: "globe",
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left",
    );

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(10, 14, 23)",
        "high-color": "rgb(20, 30, 60)",
        "horizon-blend": 0.06,
        "space-color": "rgb(5, 8, 18)",
        "star-intensity": 0.8,
      });
    });

    map.on("click", (e) => {
      onMapClick(e.lngLat.lng, e.lngLat.lat);
    });

    map.getCanvas().style.cursor = "crosshair";

    mapRef.current = map;
    return () => map.remove();
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current || !selectedCoords) return;

    markerRef.current?.remove();

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div class="marker-outer">
        <div class="marker-inner"></div>
        <div class="marker-pulse"></div>
      </div>
    `;

    const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(selectedCoords)
      .addTo(mapRef.current);

    markerRef.current = marker;

    mapRef.current.flyTo({
      center: selectedCoords,
      zoom: 5,
      duration: 1800,
      essential: true,
    });
  }, [selectedCoords]);

  return (
    <>
      <style>{`
        .custom-marker { position: relative; width: 32px; height: 32px; }
        .marker-outer { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .marker-inner {
          width: 14px; height: 14px;
          background: #f97316;
          border-radius: 50%;
          border: 2.5px solid #fff;
          box-shadow: 0 0 12px rgba(249,115,22,0.8);
          z-index: 2;
          position: relative;
        }
        .marker-pulse {
          position: absolute;
          width: 32px; height: 32px;
          background: rgba(249,115,22,0.25);
          border-radius: 50%;
          animation: pulse 1.8s ease-out infinite;
          top: 0; left: 0;
        }
        @keyframes pulse {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
      />
    </>
  );
}
