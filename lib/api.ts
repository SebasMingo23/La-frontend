import type { UltimoResultado, Resultado, Local, Predicciones, Palpite, DreamEntry, PagesContent, SiteSettings } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/wp-json/la/v1'

const FETCH_TIMEOUT_MS = 8_000

async function apiFetch<T>(endpoint: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status} en ${endpoint}`)
  }
  return res.json() as Promise<T>
}

export const getUltimoResultado = () =>
  apiFetch<UltimoResultado>('/ultimo-resultado', 30)


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

type PrediccionRaw = {
  animal_id: string
  animal_name: string
  thousand: string
  hundred: string
  ten: string
  date?: string
}

export const getPalpites = async (): Promise<Palpite[]> => {
  const raw = await apiFetch<PrediccionRaw[]>('/predicciones', 3600)
  return raw.map((item, index) => ({
    id:           parseInt(item.animal_id, 10),
    nombre_animal: item.animal_name,
    numero:        item.animal_id.padStart(2, '0'),
    milesima:      item.thousand,
    cento:         item.hundred,
    docena:        item.ten,
    image_url:     '',
    confianza:     Math.max(90 - index * 5, 55),
  }))
}

export const getDreamsDictionary = () =>
  apiFetch<DreamEntry[]>('/dreams-dictionary', 3600)

export const getPages = () =>
  apiFetch<PagesContent>('/pages', 3600) // contenido institucional, cachea 1h

export const getSettings = () =>
  apiFetch<SiteSettings>('/settings', 3600) // ajustes globales, cachea 1h
