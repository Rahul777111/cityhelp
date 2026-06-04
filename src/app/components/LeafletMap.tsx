"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMapType, LayerGroup } from "leaflet";
import type { Report } from "@/lib/data";
import { CITY_CENTER } from "@/lib/data";
import { STATUS_META } from "./shared";

// Leaflet is imported dynamically inside the effect to stay client-only.
export default function LeafletMap({
  reports,
  activeId,
  onSelect,
}: {
  reports: Report[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapType | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  // init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, {
        center: [CITY_CENTER.lat, CITY_CENTER.lng],
        zoom: 12,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      renderMarkers();
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-render markers whenever reports or active change
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, activeId]);

  function renderMarkers() {
    const L = LRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    for (const r of reports) {
      const color = STATUS_META[r.status].color;
      const active = r.id === activeId;
      const size = active ? 30 : 22;
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};border:3px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,.35)${active ? `,0 0 0 6px ${color}33` : ""};
          display:grid;place-items:center;transition:all .2s;">
          <span style="width:6px;height:6px;border-radius:50%;background:#fff;display:block"></span>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([r.lat, r.lng], { icon }).addTo(layer);
      marker.bindPopup(
        `<div style="font-family:system-ui;min-width:170px">
          <div style="font-weight:600;font-size:13px;margin-bottom:2px">${escapeHtml(r.title)}</div>
          <div style="font-size:12px;color:#5b7081">${escapeHtml(r.area)} · ${r.upvotes} upvotes</div>
          <div style="margin-top:4px;font-size:11px;font-weight:600;color:${color}">${STATUS_META[r.status].label}</div>
        </div>`,
        { closeButton: false }
      );
      marker.on("click", () => onSelect?.(r.id));
      if (active) marker.openPopup();
    }
  }

  return (
    <div
      ref={containerRef}
      className="aspect-[16/11] w-full overflow-hidden rounded-2xl border border-[var(--border)]"
      style={{ background: "#e8f0ee" }}
    />
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
