"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Loader2, Minimize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LatLng } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const CENTER: LatLng = { latitude: -23.4102, longitude: -51.9377 };
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const PIN_SVG = `
<svg viewBox="0 0 24 24" width="34" height="34" xmlns="http://www.w3.org/2000/svg"
  style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))">
  <path fill="#ef4444" stroke="#ffffff" stroke-width="1.6"
    d="M12 2a7 7 0 0 0-7 7c0 4.9 6.1 11.3 7 12.2.9-.9 7-7.3 7-12.2a7 7 0 0 0-7-7Z"/>
  <circle cx="12" cy="9" r="2.6" fill="#ffffff"/>
</svg>`;

function ClickCatcher({ onGuess }: { onGuess: (point: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onGuess({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

function ResizeSync() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    if (!el) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => map.invalidateSize());
    });
    observer.observe(el);
    requestAnimationFrame(() => map.invalidateSize());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

function MapInteractions({ enabled }: { enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    const handlers = [
      map.touchZoom,
      map.doubleClickZoom,
      map.scrollWheelZoom,
      map.boxZoom,
      map.keyboard,
      map.dragging,
    ].filter(Boolean) as L.Handler[];
    handlers.forEach((handler) => {
      if (enabled) {
        if (!handler.enabled()) handler.enable();
      } else if (handler.enabled()) {
        handler.disable();
      }
    });
  }, [enabled, map]);
  return null;
}

interface GuessMinimapProps {
  guess: LatLng | null;
  onGuess: (point: LatLng) => void;
  onClear: () => void;
  onConfirm: () => void;
  submitting?: boolean;
  disabled?: boolean;
  timeLeft?: number;
  totalTime?: number;
}

export function GuessMinimap({
  guess,
  onGuess,
  onClear,
  onConfirm,
  submitting = false,
  disabled = false,
  timeLeft,
  totalTime,
}: GuessMinimapProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const hasGuess = guess != null;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        // Only auto-close if no guess is placed
        if (!hasGuess) {
          setOpen(false);
          setDismissed(true);
        }
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [hasGuess]);

  // Hint logic
  useEffect(() => {
    if (open && !hasGuess) {
      setShowHint(true);
      const t = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowHint(false);
    }
  }, [open, hasGuess]);

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: PIN_SVG,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      }),
    []
  );

  const expanded = !dismissed && (open || (hasGuess && !disabled));
  const interactive = expanded && !disabled;
  const canConfirm = hasGuess && !disabled;

  return (
    <div
      ref={rootRef}
      className="absolute bottom-4 right-4 z-[1000] flex flex-col items-end gap-2"
    >
      <div
        className="cursor-pointer"
        onMouseEnter={() => {
          setDismissed(false);
          setOpen(true);
        }}
        onMouseLeave={() => {
          if (!hasGuess) {
            setOpen(false);
          }
        }}
      >
        {mounted ? (
          <motion.div
            layout
            initial={false}
            animate={{
              height: expanded ? "var(--expanded-h)" : "var(--collapsed-h)",
              width: expanded ? "var(--expanded-w)" : "var(--collapsed-w)",
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{
              "--expanded-w": "min(90vw, 30rem)",
              "--expanded-h": "26rem",
              "--collapsed-w": "11rem",
              "--collapsed-h": "6rem",
            } as any}
            className={cn(
              "overflow-hidden rounded-2xl bg-background shadow-2xl relative",
              canConfirm && expanded ? "border-2 border-green-500/80 animate-pulse-border" : "border",
              expanded ? "p-2" : "p-0"
            )}
          >
            <div
              className={cn(
                "relative h-full w-full",
                !expanded && "pointer-events-none",
                expanded && (hasGuess ? "cursor-grab" : "cursor-crosshair")
              )}
            >
              <MapContainer
                center={[CENTER.latitude, CENTER.longitude]}
                zoom={15}
                className={cn(
                  "h-full w-full rounded-xl",
                  expanded && !hasGuess && "leaflet-crosshair"
                )}
                zoomControl={false}
                attributionControl={false}
                preferCanvas
              >
                <TileLayer url={TILE_URL} attribution="" />
                <ResizeSync />
                <MapInteractions enabled={interactive} />
                {interactive ? <ClickCatcher onGuess={onGuess} /> : null}
                {guess ? (
                  <Marker
                    position={[guess.latitude, guess.longitude]}
                    icon={icon}
                    interactive={false}
                  />
                ) : null}
              </MapContainer>

              {!expanded ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="grid size-10 place-items-center rounded-full bg-background/85 text-muted-foreground backdrop-blur-sm shadow-sm">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m2 12 10-3 10 3" />
                      <path d="m12 2 3 10-3 10" />
                      <path d="M12 2v20" />
                    </svg>
                  </span>
                </div>
              ) : null}

              {/* Top Right Controls (Minimize) */}
              {expanded ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setDismissed(true);
                  }}
                  aria-label="Minimizar mapa"
                  className="absolute right-2 top-2 z-[1000] grid size-8 cursor-pointer place-items-center rounded-full bg-background/85 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
                >
                  <Minimize2 className="size-4" />
                </button>
              ) : null}

              {/* Top Left Time info (if provided) */}
              {expanded && timeLeft !== undefined && (
                <div className="absolute left-2 top-2 z-[1000] flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
                  <span className={cn(timeLeft < 10 ? "text-red-500 font-bold" : "text-foreground")}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              {/* Bottom Right Controls (Clear Guess) */}
              {expanded && hasGuess && !disabled ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  aria-label="Limpar palpite"
                  className="absolute right-2 bottom-2 z-[1000] grid size-8 cursor-pointer place-items-center rounded-full bg-destructive/90 text-destructive-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}

              {/* Hint Overlay */}
              <AnimatePresence>
                {expanded && showHint && !hasGuess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-foreground/90 px-4 py-2 text-sm font-medium text-background shadow-lg"
                  >
                    Clique no mapa para marcar seu palpite
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </div>

      {canConfirm ? (
        <div className="w-[min(20rem,calc(100vw-2rem))] sm:w-[30rem]">
          <Button
            size="lg"
            className="h-12 w-full gap-2 rounded-2xl bg-gradient-to-b from-primary to-primary/85 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:from-primary hover:to-primary/70 hover:shadow-primary/40"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
            {submitting ? "Enviando palpite..." : "Confirmar palpite"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}