"use client"

import { useEffect, useRef } from "react"
import type { Local } from "@/lib/types"
import "leaflet/dist/leaflet.css"

interface Props {
  locales: Local[]
  onSelectLocal?: (id: number) => void  // opcional: navegar a /puntos-de-venta?id=X
}

// Marcador naranja con efecto glow — mismo estilo que la imagen de referencia
const MARKER_HTML = `
  <div style="position:relative;width:36px;height:36px;">
    <div style="
      position:absolute;inset:0;
      background:rgba(255,122,0,0.25);
      border-radius:50%;
      animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
    "></div>
    <div style="
      position:relative;
      width:36px;height:36px;
      background:#FF7A00;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 0 3px rgba(255,122,0,0.3), 0 0 20px rgba(255,122,0,0.5);
    ">
      <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='white'>
        <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
      </svg>
    </div>
  </div>
`

export function MapaLocales({ locales, onSelectLocal }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let cancelled = false

    // Asunción, Paraguay — centro por defecto
    const ASUNCION: [number, number] = [-25.2867, -57.647]

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      // Clear stale Leaflet internal state (React StrictMode runs effects twice)
      const container = containerRef.current as HTMLDivElement & { _leaflet_id?: number }
      if (container._leaflet_id != null) delete container._leaflet_id

      const map = L.map(containerRef.current, {
        center: ASUNCION,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,   // evita scroll accidental en la página
        attributionControl: true,
      })

      // Tiles oscuros de CartoDB — sin API key, gratis
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map)

      // Ícono personalizado naranja
      const orangeIcon = L.divIcon({
        className: "",
        html: MARKER_HTML,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
      })

      // Agregar marcadores para cada local
      locales.forEach((local) => {
        const lat = parseFloat(local.latitud)
        const lng = parseFloat(local.longitud)
        if (isNaN(lat) || isNaN(lng)) return

        const marker = L.marker([lat, lng], { icon: orangeIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:13px;font-weight:600;color:#1E2B3E;">${local.nombre}</div>`,
            { className: "loteria-popup" }
          )

        if (onSelectLocal) {
          marker.on("click", () => onSelectLocal(local.id))
        }
      })

      // Ajustar vista para mostrar todos los marcadores
      if (locales.length > 0) {
        const validLocales = locales.filter(
          (l) => !isNaN(parseFloat(l.latitud)) && !isNaN(parseFloat(l.longitud))
        )
        if (validLocales.length > 1) {
          const bounds = L.latLngBounds(
            validLocales.map((l) => [parseFloat(l.latitud), parseFloat(l.longitud)])
          )
          map.fitBounds(bounds, { padding: [40, 40] })
        }
      }

      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [locales])

  return (
    <>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .loteria-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .loteria-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  )
}
