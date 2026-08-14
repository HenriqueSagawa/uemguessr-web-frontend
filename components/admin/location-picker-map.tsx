"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/api-types";
import { cn } from "@/lib/utils";

const CAMPUS_CENTER: LatLng = { latitude: -23.4102, longitude: -51.9377 };
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const PIN_SVG = (color: string) => `
<svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg"
  style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))">
  <path fill="${color}" stroke="#ffffff" stroke-width="1.6"
    d="M12 2a7 7 0 0 0-7 7c0 4.9 6.1 11.3 7 12.2.9-.9 7-7.3 7-12.2a7 7 0 0 0-7-7Z"/>
  <circle cx="12" cy="9" r="2.6" fill="#ffffff"/>
</svg>`;

function MapClicker({ onSelect }: { onSelect: (point: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

function SyncMarker({ point }: { point: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([point.latitude, point.longitude], Math.max(map.getZoom(), 16), {
      duration: 0.8,
    });
  }, [point, map]);
  return null;
}

interface LocationPickerMapProps {
  point: LatLng | null;
  onSelect: (point: LatLng) => void;
  className?: string;
}

export function LocationPickerMap({
  point,
  onSelect,
  className,
}: LocationPickerMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const icon = useMemo(() => {
    return L.divIcon({
      className: "",
      html: PIN_SVG("#6366f1"),
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "animate-pulse rounded-2xl border bg-muted",
          className ?? "h-72"
        )}
      />
    );
  }

  return (
    <div className={className ?? "h-72"}>
      <MapContainer
        center={[CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude]}
        zoom={16}
        className="h-full w-full rounded-2xl border"
        scrollWheelZoom
        zoomControl
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapClicker onSelect={onSelect} />
        {point ? (
          <>
            <Marker position={[point.latitude, point.longitude]} icon={icon} />
            <SyncMarker point={point} />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}