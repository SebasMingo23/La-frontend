'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Banner } from '@/lib/types'

import { WORDPRESS_API_URL } from '@/lib/constants'

const API_BASE = WORDPRESS_API_URL

/** Garantiza URL absoluta — WP a veces devuelve paths relativos en staging */
function toAbsoluteUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  try {
    const origin = new URL(API_BASE).origin
    return origin + (url.startsWith('/') ? url : `/${url}`)
  } catch {
    return url
  }
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SlideContent({ banner, index }: { banner: Banner; index: number }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={toAbsoluteUrl(banner.image_url)}
        alt={banner.alt_text ?? banner.title ?? `Banner promocional ${index + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading={index === 0 ? "eager" : "lazy"}
      />
      {(banner.title || banner.subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 md:p-10 pointer-events-none">
          {banner.title && (
            <h2 className="font-[family-name:var(--font-gunterz)] text-white text-xl md:text-3xl lg:text-4xl drop-shadow-md">
              {banner.title}
            </h2>
          )}
          {banner.subtitle && (
            <p className="font-[family-name:var(--font-resonate)] text-white/85 text-sm md:text-base mt-1 drop-shadow">
              {banner.subtitle}
            </p>
          )}
        </div>
      )}
    </>
  )

  if (banner.link_url) {
    return (
      <a
        href={banner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
      >
        {inner}
      </a>
    )
  }

  return <div className="absolute inset-0">{inner}</div>
}

export function BannersSlider() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const touchStartX = useRef<number>(0)

  useEffect(() => {
    fetch(`${API_BASE}/banners`)
      .then(res => {
        if (!res.ok) return null
        return res.json() as Promise<Banner[]>
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length)
  }, [banners.length])

  const goPrev = useCallback(() => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [banners.length, isPaused, goNext])

  // Return null silently if still loading or no banners (endpoint missing / empty)
  if (!loaded || banners.length === 0) return null

  const hasMultiple = banners.length > 1

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev()
    }
    setIsPaused(false)
  }

  return (
    <section className="w-full px-2 md:px-8 py-4">
      <div
        className="relative w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)] aspect-[16/9] md:aspect-[16/5]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <SlideContent banner={banner} index={i} />
          </div>
        ))}

        {/* Prev / Next arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
              aria-label="Banner anterior"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
              aria-label="Siguiente banner"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultiple && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2.5 bg-[#FF7A00]'
                    : 'w-2.5 h-2.5 bg-white/45 hover:bg-white/75'
                }`}
                aria-label={`Ir al banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
