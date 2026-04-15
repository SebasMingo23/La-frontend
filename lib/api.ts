import type { UltimoResultado, Ganador, Resultado, Local, Predicciones, Palpite, DreamEntry, PagesContent, SiteSettings } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/wp-json/la/v1'

async function apiFetch<T>(endpoint: string, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate },
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[apiFetch] ${res.status} en ${endpoint} — body:`, body)
      throw new Error(`API error ${res.status} en ${endpoint}`)
    }
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`[apiFetch] Error en ${endpoint}:`, error)
    throw error
  }
}

export const getUltimoResultado = () =>
  apiFetch<UltimoResultado>('/ultimo-resultado', 30)

export const getGanadores = (limit = 6) =>
  apiFetch<Ganador[]>(`/ganadores?limit=${limit}`, 300)

export const getResultados = (limit = 20, fecha?: string, turno?: string) => {
  const params = new URLSearchParams({ limit: String(limit) })
  if (fecha) params.set('fecha', fecha)
  if (turno) params.set('turno', turno)
  return apiFetch<Resultado[]>(`/resultados?${params.toString()}`, 60)
}

export const getLocales = () =>
  apiFetch<Local[]>('/locales', 3600)

export const getPredicciones = () =>
  apiFetch<Predicciones>('/predicciones', 300)

export const getPalpites = () =>
  apiFetch<Palpite[]>('/palpites', 3600)

export const getDreamsDictionary = () =>
  apiFetch<DreamEntry[]>('/dreams-dictionary', 3600)

export const getPages = () =>
  apiFetch<PagesContent>('/pages', 3600) // contenido institucional, cachea 1h

export const getSettings = () =>
  apiFetch<SiteSettings>('/settings', 3600) // ajustes globales, cachea 1h
