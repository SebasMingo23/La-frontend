/**
 * sanitizeWpHtml — limpieza server-side del HTML que devuelve WordPress.
 *
 * Objetivo: mitigar XSS stored si la cuenta de administrador de WP fuera
 * comprometida e inyectara contenido malicioso en las páginas institucionales.
 *
 * No reemplaza un WAF ni la seguridad en WP, pero es una capa de defensa
 * adicional antes de pasar el string a dangerouslySetInnerHTML.
 *
 * Solo se usa en páginas de contenido estático (reglamento, términos, etc.)
 * que son Server Components cacheados con ISR — nunca en el cliente.
 */
export function sanitizeWpHtml(raw: string): string {
  if (!raw) return ""

  return raw
    // 1. Eliminar bloques <script>…</script> completos
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // 2. Eliminar bloques <style> inline (pueden ocultar contenido o redirigir)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    // 3. Eliminar handlers de eventos inline (onclick, onmouseover, onerror, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // 4. Eliminar hrefs / src con javascript: o data:text/html
    .replace(/(href|src|action)\s*=\s*["']?\s*javascript:[^"'>]*/gi, '$1="#"')
    .replace(/(href|src|action)\s*=\s*["']?\s*data:text\/html[^"'>]*/gi, '$1="#"')
    // 5. Eliminar <iframe> y <object> — no son necesarios en contenido editorial
    .replace(/<\/?(?:iframe|object|embed|form|input|button)\b[^>]*>/gi, "")
}
