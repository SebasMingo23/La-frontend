// GET /ultimo-resultado
export interface UltimoResultado {
  draw_date: string;
  animal_name: string;
  animal_id: number | null;
  number: string;
  image_url: string;
  infographic_url?: string;
  description: string;
}

// GET /dreams-dictionary
export interface DreamEntry {
  id: number;
  name: string;      // nombre del animal
  number: number;    // id del animal = número de lotería (1-25)
  image_url: string;
  dreams: string;    // keywords separadas por coma: "agua, lluvia, río"
}

// GET /palpites
export interface Palpite {
  id: number;
  nombre_animal: string;
  numero: string;       // "01"–"25" (animal_id zero-padded)
  milesima: string;     // "0000"–"9999"
  cento: string;        // "000"–"999"
  docena: string;       // "00"–"99"
  image_url: string;    // desde tabla animals
  confianza: number;    // 0–100
}

// GET /ganadores
export interface Ganador {
  id: number;
  nombre: string;
  ciudad: string;
  premio: string;        // texto libre: "1.500.000 Gs."
  fecha: string;         // "YYYY-MM-DD"
  foto_url: string;
  is_grand_prize: number; // 1 = mostrar badge Gran Premio
}

// GET /resultados
export interface Resultado {
  id: number;
  animal: string;
  numero: string;      // "01" … "36"  (zero-padded)
  fecha: string;       // "YYYY-MM-DD"
  turno: string;       // "Mañana" | "Tarde" | "Noche"
  imagen_url: string;
  infographic_url?: string;
  descripcion: string;
}

// GET /locales
export interface Local {
  id: number;
  nombre: string;
  latitud: string;
  longitud: string;
  direccion?: string;
  telefono?: string;
  foto_url?: string;
}

// GET /settings
export interface SiteSettings {
  whatsapp_number?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  youtube_url?: string
  phone?: string
  email?: string
}

// GET /pages
export interface PagesContent {
  tabla_premios: string
  reglamento: string
  sobre_loteria: string
  terminos_condiciones: string
  politica_privacidad: string
  juego_responsable: string
}

// GET /banners
export interface Banner {
  id: number
  image_url: string
  title?: string
  subtitle?: string
  link_url?: string
  alt_text?: string
}

// GET /predicciones
export interface Predicciones {
  animal_caliente: {
    nombre: string;
    apariciones_semana: number;
  };
  animal_frio: {
    nombre: string;
    dias_sin_salir: number;
  };
}
