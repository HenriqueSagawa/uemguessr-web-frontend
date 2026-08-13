"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/api-types";

const CAMPUS_CENTER: LatLng = { latitude: -23.4102, longitude: -51.9377 };
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const PIN_SVG = (color: string, glow: boolean) => `
<svg viewBox="0 0 24 24" width="34" height="34" xmlns="http://www.w3.org/2000/svg"
  style="filter:${glow ? "drop-shadow(0 2px 6px rgba(0,0,0,.45))" : "none"}">
  <path fill="${color}" stroke="#ffffff" stroke-width="1.6"
    d="M12 2a7 7 0 0 0-7 7c0 4.9 6.1 11.3 7 12.2.9-.9 7-7.3 7-12.2a7 7 0 0 0-7-7Z"/>
  <circle cx="12" cy="9" r="2.6" fill="#ffffff"/>
</svg>`;

function makeIcon(color: string, glow: boolean) {
  return L.divIcon({
    className: "",
    html: PIN_SVG(color, glow),
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

function ClickCatcher({ onGuess }: { onGuess?: (point: LatLng) => void }) {
  useMapEvents({
    click(event) {
      if (!onGuess) return;
      onGuess({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ point }: { point: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (!point) return;
    map.flyTo([point.latitude, point.longitude], Math.max(map.getZoom(), 15), {
      duration: 0.9,
    });
  }, [point, map]);
  return null;
}

interface GameMapProps {
  center?: LatLng;
  zoom?: number;
  guess?: LatLng | null;
  correct?: LatLng | null;
  disabled?: boolean;
  onGuess?: (point: LatLng) => void;
  className?: string;
}

export function GameMap({
  center = CAMPUS_CENTER,
  zoom = 16,
  guess = null,
  correct = null,
  disabled = false,
  onGuess,
  className,
}: GameMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const guessIcon = useMemo(() => makeIcon("#ef4444", true), []);
  const correctIcon = useMemo(() => makeIcon("#22c55e", true), []);
  const polyline = useMemo(
    () =>
      guess && correct
        ? [
            [guess.latitude, guess.longitude] as [number, number],
            [correct.latitude, correct.longitude] as [number, number],
          ]
        : null,
    [guess, correct]
  );

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={
          "animate-pulse rounded-2xl border bg-muted " + (className ?? "h-full min-h-[24rem]")
        }
      />
    );
  }

  return (
    <div className={className ?? "h-full min-h-[24rem]"}>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        className="h-full w-full rounded-2xl border"
        attributionControl
        scrollWheelZoom
        zoomControl
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {!disabled ? <ClickCatcher onGuess={onGuess} /> : null}
        {guess ? <Marker position={[guess.latitude, guess.longitude]} icon={guessIcon} /> : null}
        {correct ? (
          <Marker position={[correct.latitude, correct.longitude]} icon={correctIcon} />
        ) : null}
        {polyline ? (
          <Polyline positions={polyline} pathOptions={{ color: "#6366f1", weight: 3, dashArray: "8 8" }} />
        ) : null}
        {correct ? <FlyTo point={correct} /> : guess ? <FlyTo point={guess} /> : null}
      </MapContainer>
    </div>
  );
}