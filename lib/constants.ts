/**
 * URL base de la API de WordPress.
 * En producción debe estar seteada via NEXT_PUBLIC_API_URL en el entorno del servidor.
 * El fallback a localhost garantiza que el entorno local siga funcionando sin cambios.
 */
export const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/wp-json/la/v1'
