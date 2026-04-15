// Official 25 animals of the "Juego del Bicho" lottery
// Images are served from Next.js /public/images/animales/ (local static assets).
// DB priority: resolveImage() checks image_url from API first; this file is fallback only.
// ⚠️  IDs 03, 10, 12, 15, 19, 22, 24 — copy their PNG from VPS staging before local dev.
//    See: fix_animals_image_url_local.sql for the SCP command.
export const animals = [
  { id: 1,  name: "Avestruz",  number: "01", image: "/images/animales/avestruz-iconos-animales-dorado.png" },
  { id: 2,  name: "Águila",    number: "02", image: "/images/animales/aguila-iconos-animales-dorado.png" },
  { id: 3,  name: "Burro",     number: "03", image: "/images/animales/burro-iconos-animales-dorado.png" },
  { id: 4,  name: "Mariposa",  number: "04", image: "/images/animales/mariposa-iconos-animales-dorado.png" },
  { id: 5,  name: "Perro",     number: "05", image: "/images/animales/perro-iconos-animales-dorado.png" },
  { id: 6,  name: "Cabra",     number: "06", image: "/images/animales/cabra-iconos-animales-dorado.png" },
  { id: 7,  name: "Oveja",     number: "07", image: "/images/animales/oveja-iconos-animales-dorado.png" },
  { id: 8,  name: "Camello",   number: "08", image: "/images/animales/camello-iconos-animales-dorado.png" },
  { id: 9,  name: "Cobra",     number: "09", image: "/images/animales/cobra-iconos-animales-dorado.png" },
  { id: 10, name: "Conejo",    number: "10", image: "/images/animales/conejo-iconos-animales-dorado.png" },
  { id: 11, name: "Caballo",   number: "11", image: "/images/animales/caballo-iconos-animales-dorado.png" },
  { id: 12, name: "Elefante",  number: "12", image: "/images/animales/elefante-iconos-animales-dorado.png" },
  { id: 13, name: "Gallo",     number: "13", image: "/images/animales/gallina-iconos-animales-dorado.png" },
  { id: 14, name: "Gato",      number: "14", image: "/images/animales/gato-iconos-animales-dorado.png" },
  { id: 15, name: "Jacaré",    number: "15", image: "/images/animales/cocodrilo-iconos-animales-dorado.png" },
  { id: 16, name: "León",      number: "16", image: "/images/animales/leon-iconos-animales-dorado.png" },
  { id: 17, name: "Mono",      number: "17", image: "/images/animales/mono-iconos-animales-dorado.png" },
  { id: 18, name: "Chancho",   number: "18", image: "/images/animales/chancho-iconos-animales-dorado.png" },
  { id: 19, name: "Pavo real", number: "19", image: "/images/animales/pavo-iconos-animales-dorado.png" },
  { id: 20, name: "Pavo",      number: "20", image: "/images/animales/pavo-iconos-animales-dorado.png" },
  { id: 21, name: "Toro",      number: "21", image: "/images/animales/toro-iconos-animales-dorado.png" },
  { id: 22, name: "Tigre",     number: "22", image: "/images/animales/tigre-iconos-animales-dorado.png" },
  { id: 23, name: "Oso",       number: "23", image: "/images/animales/oso-iconos-animales-dorado.png" },
  { id: 24, name: "Venado",    number: "24", image: "/images/animales/ciervo-iconos-animales-dorado.png" },
  { id: 25, name: "Vaca",      number: "25", image: "/images/animales/vaca-iconos-animales-dorado.png" },
] as const

export type Animal = typeof animals[number]
