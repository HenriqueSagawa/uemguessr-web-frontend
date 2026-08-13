"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const ZOOM_STEP = 1.2;

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface PanoViewerProps {
  imageUrl: string;
  alt?: string;
}

export function PanoViewer({ imageUrl, alt = "" }: PanoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null);

  const clampOffset = useCallback((x: number, y: number, scale: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxX = (el.clientWidth * (scale - 1)) / 2;
    const maxY = (el.clientHeight * (scale - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      const el = containerRef.current;
      if (!el) return;
      setTransform((prev) => {
        const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor));
        const midX = el.clientWidth / 2;
        const midY = el.clientHeight / 2;
        const ratio = nextScale / prev.scale;
        const x = (prev.x - (cx - midX)) * ratio + (cx - midX);
        const y = (prev.y - (cy - midY)) * ratio + (cy - midY);
        return { scale: nextScale, ...clampOffset(x, y, nextScale) };
      });
    },
    [clampOffset]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const zoomBy = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    zoomAt(el.clientWidth / 2, el.clientHeight / 2, factor);
  };

  const reset = () => setTransform({ scale: 1, x: 0, y: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: transform.x,
      y: transform.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    setTransform((prev) => ({
      ...prev,
      ...clampOffset(drag.x + dx, drag.y + dy, prev.scale),
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const needsReset = transform.scale > 1 || transform.x !== 0 || transform.y !== 0;

  return (
    <div
      ref={containerRef}
      className={
        "relative h-full w-full touch-none overflow-hidden select-none " +
        (dragging ? "cursor-grabbing" : "cursor-grab")
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute inset-0 bg-black will-change-transform"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
          transition: dragging ? "none" : "transform 200ms ease-out",
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="100vw"
          priority
          draggable={false}
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-5 left-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => zoomBy(ZOOM_STEP)}
          aria-label="Aproximar"
          className="grid size-9 cursor-pointer place-items-center rounded-full border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform hover:scale-105"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          aria-label="Afastar"
          className="grid size-9 cursor-pointer place-items-center rounded-full border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform hover:scale-105"
        >
          <ZoomOut className="size-4" />
        </button>
        {needsReset ? (
          <button
            type="button"
            onClick={reset}
            aria-label="Centralizar"
            className="grid size-9 cursor-pointer place-items-center rounded-full border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Maximize2 className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}