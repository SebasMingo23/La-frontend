"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

// Colores del `main` que se ven en los *gaps* entre secciones
const sectionColorsDark: Record<string, string> = {
  resultados:   "#111116",
  ganadores:    "#1E2B3E",
  predicciones: "#009640",
  suenos:       "#111116",
  ubicaciones:  "#4A3123",
  "como-jugar": "#1E2B3E",
}

const sectionColorsLight: Record<string, string> = {
  resultados:   "#e6f9ee",   // tinte verde — combina con los blobs del hero
  ganadores:    "#ffffff",
  predicciones: "#009640",
  suenos:       "#2A2A2A",
  ubicaciones:  "#4A3123",
  "como-jugar": "#f8f9fa",
}

export function ScrollBackground({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [bgColor, setBgColor] = useState("#111116")

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const isDark = !mounted || resolvedTheme === "dark"
    const colorMap = isDark ? sectionColorsDark : sectionColorsLight
    const sectionIds = Object.keys(colorMap)

    const handleScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.45
      let activeSection = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= scrollMid) activeSection = id
      }
      setBgColor(colorMap[activeSection] ?? (isDark ? "#111116" : "#f8f9fa"))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mounted, resolvedTheme])

  return (
    <main
      className="relative min-h-screen transition-colors duration-700 ease-in-out"
      style={{ position: 'relative', backgroundColor: mounted ? bgColor : "#111116" }}
    >
      {children}
    </main>
  )
}
