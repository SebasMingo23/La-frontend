"use client"

import { useEffect, useRef } from "react"
import type { Local } from "@/lib/types"
import "leaflet/dist/leaflet.css"

interface Props {
  locales: Local[]
  selectedId: number | null
  onSelectLocal: (id: number) => void
}

const ASUNCION: [number, number] = [-25.2867, -57.647]

const makeMarkerHtml = (selected: boolean) => `
  <div style="position:relative;width:${selected ? 44 : 36}px;height:${selected ? 44 : 36}px;">
    <div style="
      position:absolute;inset:0;
      background:rgba(255,122,0,${selected ? 0.4 : 0.25});
      border-radius:50%;
      animation:ping-map 1.5s cubic-bezier(0,0,0.2,1) infinite;
    "></div>
    <div style="
      position:relative;
      width:${selected ? 44 : 36}px;height:${selected ? 44 : 36}px;
      background:#FF7A00;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 0 ${selected ? 4 : 3}px rgba(255,122,0,${selected ? 0.5 : 0.3}),
                 0 0 ${selected ? 30 : 20}px rgba(255,122,0,${selected ? 0.7 : 0.5});
      ${selected ? "border:2px solid white;" : ""}
    ">
      <svg xmlns='http://www.w3.org/2000/svg' width='${selected ? 22 : 18}' height='${selected ? 22 : 18}' viewBox='0 0 24 24' fill='white'>
        <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
      </svg>
    </div>
  </div>
`

export function MapaInteractivo({ locales, selectedId, onSelectLocal }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<any>(null)
  const markersRef    = useRef<Record<number, any>>({})
  const LRef          = useRef<any>(null)
  // Permite que el efecto de selectedId actúe incluso antes de que Leaflet termine de inicializar
  const pendingIdRef  = useRef<number | null>(selectedId)

  // ─── Inicialización del mapa ───────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return
      LRef.current = L

      const map = L.map(containerRef.current, {
        center: ASUNCION,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
      })

      // CARTO Dark Matter All — fondo oscuro con etiquetas de calles en blanco
      // dark_all incluye labels; dark_nolabels los omite. Usamos dark_all para visibilidad.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          minZoom: 10,
          maxZoom: 19,
        }
      ).addTo(map)

      // Crear iconos base
      const makeIcon = (selected: boolean) =>
        L.divIcon({
          className: "",
          html: makeMarkerHtml(selected),
          iconSize: [selected ? 44 : 36, selected ? 44 : 36],
          iconAnchor: [selected ? 22 : 18, selected ? 44 : 36],
          popupAnchor: [0, -40],
        })

      locales.forEach((local) => {
        const lat = parseFloat(local.latitud)
        const lng = parseFloat(local.longitud)
        if (isNaN(lat) || isNaN(lng)) return

        const isSelected = local.id === pendingIdRef.current

        const photoHtml = local.foto_url
          ? `<img src="${local.foto_url}" alt="${local.nombre}"
               style="width:100%;height:96px;object-fit:cover;border-radius:8px;
                      margin-bottom:8px;display:block;">`
          : ""
        const dirHtml = local.direccion
          ? `<p style="margin:3px 0 0;font-size:11px;color:#6b7280;display:flex;align-items:flex-start;gap:4px;">
               <span style="flex-shrink:0;margin-top:1px;">📍</span><span>${local.direccion}</span>
             </p>`
          : ""
        const telHtml = local.telefono
          ? `<p style="margin:3px 0 0;font-size:11px;color:#6b7280;display:flex;align-items:center;gap:4px;">
               <span>📞</span><span>${local.telefono}</span>
             </p>`
          : ""

        const popupHtml = `
          <div style="font-family:system-ui,sans-serif;min-width:180px;max-width:220px;">
            ${photoHtml}
            <p style="margin:0;font-size:13px;font-weight:700;color:#1E2B3E;line-height:1.3;">
              ${local.nombre}
            </p>
            ${dirHtml}
            ${telHtml}
          </div>`

        const marker = L.marker([lat, lng], { icon: makeIcon(isSelected) })
          .addTo(map)
          .bindPopup(popupHtml, { className: "loteria-popup", maxWidth: 240 })

        marker.on("click", () => onSelectLocal(local.id))
        markersRef.current[local.id] = marker
      })

      // Ajustar bounds para mostrar todos los locales
      const valid = locales.filter(
        (l) => !isNaN(parseFloat(l.latitud)) && !isNaN(parseFloat(l.longitud))
      )
      if (valid.length > 1) {
        const bounds = L.latLngBounds(
          valid.map((l) => [parseFloat(l.latitud), parseFloat(l.longitud)] as [number, number])
        )
        map.fitBounds(bounds, { padding: [60, 60] })
      }

      mapRef.current = map

      // Si había un id pendiente, volar a él ahora que el mapa está listo
      if (pendingIdRef.current) {
        performFlyTo(pendingIdRef.current, L)
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = {}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Sincronización bidireccional: selectedId → mapa ───────────
  useEffect(() => {
    pendingIdRef.current = selectedId
    if (!mapRef.current || !LRef.current) return
    performFlyTo(selectedId, LRef.current)
  }, [selectedId])

  function performFlyTo(id: number | null, L: any) {
    // Resetear ícono de todos los marcadores
    Object.entries(markersRef.current).forEach(([markerId, marker]) => {
      const isNowSelected = Number(markerId) === id
      marker.setIcon(
        L.divIcon({
          className: "",
          html: makeMarkerHtml(isNowSelected),
          iconSize: [isNowSelected ? 44 : 36, isNowSelected ? 44 : 36],
          iconAnchor: [isNowSelected ? 22 : 18, isNowSelected ? 44 : 36],
          popupAnchor: [0, -40],
        })
      )
    })

    if (!id || !mapRef.current) return
    const local = locales.find((l) => l.id === id)
    const marker = markersRef.current[id]
    if (!local || !marker) return

    const lat = parseFloat(local.latitud)
    const lng = parseFloat(local.longitud)
    if (isNaN(lat) || isNaN(lng)) return

    mapRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1.2 })
    setTimeout(() => marker.openPopup(), 1100)
  }

  return (
    <>
      <style>{`
        @keyframes ping-map {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .loteria-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .loteria-popup .leaflet-popup-content {
          margin: 10px 12px;
        }
        .loteria-popup .leaflet-popup-tip { background: white; }
        .leaflet-control-attribution { font-size: 10px !important; }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  )
}
