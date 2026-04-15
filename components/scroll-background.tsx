"use client"

import { useState, useEffect } from "react"

const sectionColors: Record<string, string> = {
  resultados:   "#2B2B2B",
  predicciones: "#3D9B4A",
  suenos:       "#2B2B2B",
  ganadores:    "#E87722",
  ubicaciones:  "#2B2B2B",
  "como-jugar": "#F5C518",
}

export function ScrollBackground({ children }: { children: React.ReactNode }) {
  const [bgColor, setBgColor] = useState("#2B2B2B")

  useEffect(() => {
    const sectionIds = Object.keys(sectionColors)

    const handleScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.45

      let activeSection = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= scrollMid) {
          activeSection = id
        }
      }

      setBgColor(sectionColors[activeSection] ?? "#2B2B2B")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main
      className="min-h-screen transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </main>
  )
}
