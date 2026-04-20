<?php
/**
 * Plugin Name:  Lotería de Animales — Security & ISR Webhook
 * Plugin URI:   https://loteriadeanimales.com.py
 * Description:  Blindaje de la REST API, cabeceras de seguridad HTTP
 *               y webhook de revalidación ISR para el frontend Next.js.
 * Version:      1.0.0
 * Author:       Lotería de Animales
 * License:      Private
 *
 * ── INSTALACIÓN ────────────────────────────────────────────────────────────
 *
 *  1. Crear carpeta en el servidor:
 *       /var/www/html/wp-content/plugins/loteria-security/
 *
 *  2. Subir este archivo como:
 *       loteria-security.php
 *
 *  3. Agregar en wp-config.php (ANTES de "That's all, stop editing!"):
 *
 *       // Headless Next.js — Staging
 *       define( 'LA_NEXTJS_URL',        'https://staging.187.77.251.126.nip.io' );
 *       define( 'LA_REVALIDATE_SECRET', 'LTA_2026_SecR3t_w3bh00k_9f8d7c6b5a' );
 *
 *       // Al pasar a producción, cambiar solo las dos líneas de arriba:
 *       // define( 'LA_NEXTJS_URL',        'https://loteriadeanimales.com.py' );
 *       // define( 'LA_REVALIDATE_SECRET', 'LTA_2026_SecR3t_w3bh00k_9f8d7c6b5a' );
 *
 *  4. Activar el plugin desde WP Admin → Plugins → Activar.
 *
 *  5. Probar el webhook manualmente desde el VPS:
 *       curl -X POST https://staging.187.77.251.126.nip.io/api/revalidate \
 *         -H "Content-Type: application/json" \
 *         -H "x-revalidate-secret: LTA_2026_SecR3t_w3bh00k_9f8d7c6b5a" \
 *         -d '{"paths":["/"]}'
 *       Respuesta esperada: {"revalidated":["path:/"],"now":...}
 *
 * ── MAPA DE CPTs → RUTAS NEXT.JS ───────────────────────────────────────────
 *
 *  Cuando publicás un CPT de WordPress, el webhook limpia exactamente
 *  las rutas ISR de Next.js que dependen de esos datos:
 *
 *    CPT             Paths                           Tags
 *    sorteo      →   /, /resultados              →   resultados, ultimo-resultado
 *    palpite     →   /                           →   palpites
 *    ganador     →   /                           →   ganadores
 *    page        →   /reglamento, /terminos...   →   pages
 *    banner      →   /                           →   banners
 *    local       →   /, /puntos-de-venta         →   locales
 *
 * ───────────────────────────────────────────────────────────────────────────
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


/* ============================================================================
   §1 — BLINDAJE DE LA REST API
   ============================================================================ */

/**
 * Elimina endpoints nativos de WP que exponen información del sitio.
 * Next.js solo consume /la/v1/* — los endpoints /wp/v2/* son innecesarios.
 */
function la_disable_sensitive_rest_endpoints( array $endpoints ): array {
    $blocked = [
        '/wp/v2/users',
        '/wp/v2/users/(?P<id>[\d]+)',
        '/wp/v2/search',
    ];
    foreach ( $blocked as $route ) {
        unset( $endpoints[ $route ] );
    }
    return $endpoints;
}
add_filter( 'rest_endpoints', 'la_disable_sensitive_rest_endpoints' );


/**
 * Restringe la REST API nativa (/wp/v2/*) a usuarios autenticados.
 * El namespace propio del proyecto (/la/v1/*) queda siempre público.
 */
function la_restrict_native_rest_api( $result ) {
    if ( is_user_logged_in() ) {
        return $result;
    }
    $uri = isset( $_SERVER['REQUEST_URI'] )
        ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) )
        : '';
    if ( str_contains( $uri, '/wp-json/la/v1/' ) ) {
        return $result;
    }
    return new WP_Error(
        'rest_forbidden',
        __( 'REST API restringida.', 'loteria-animales' ),
        [ 'status' => 403 ]
    );
}
add_filter( 'rest_authentication_errors', 'la_restrict_native_rest_api' );


/** Oculta el enlace a la REST API en el <head> del HTML (fingerprinting). */
remove_action( 'template_redirect', 'rest_output_link_header', 11 );
remove_action( 'wp_head',           'rest_output_link_wp_head' );
remove_action( 'xmlrpc_rsd_apis',   'rest_output_rsd' );

/** Desactiva XML-RPC (vector de fuerza bruta — no se usa en Headless). */
add_filter( 'xmlrpc_enabled', '__return_false' );

/** Elimina el número de versión de WP de todas las salidas HTML. */
add_filter( 'the_generator', '__return_empty_string' );
remove_action( 'wp_head', 'wp_generator' );

/** Bloquea enumeración de usuarios vía /?author=N → redirect a /author/admin. */
function la_block_author_enumeration(): void {
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended
    if ( ! is_admin() && isset( $_GET['author'] ) ) {
        wp_die( 'No autorizado.', '', [ 'response' => 403 ] );
    }
}
add_action( 'init', 'la_block_author_enumeration' );


/* ============================================================================
   §2 — WEBHOOK ISR: WordPress notifica a Next.js al publicar contenido
   ============================================================================ */

/**
 * Mapa de CPTs → rutas y tags de caché de Next.js a revalidar.
 *
 * paths: rutas ISR estáticas generadas por Next.js.
 * tags:  cache tags para `revalidateTag()` (si se usan en lib/api.ts).
 */
const LA_REVALIDATION_MAP = [
    'sorteo'  => [
        'paths' => [ '/', '/resultados' ],
        'tags'  => [ 'resultados', 'ultimo-resultado' ],
    ],
    'palpite' => [
        'paths' => [ '/' ],
        'tags'  => [ 'palpites' ],
    ],
    'ganador' => [
        'paths' => [ '/' ],
        'tags'  => [ 'ganadores' ],
    ],
    'page'    => [
        'paths' => [
            '/reglamento',
            '/terminos-y-condiciones',
            '/politica-de-privacidad',
            '/sobre-la-loteria',
            '/tabla-de-premios',
            '/juego-responsable',
        ],
        'tags'  => [ 'pages' ],
    ],
    'banner'  => [
        'paths' => [ '/' ],
        'tags'  => [ 'banners' ],
    ],
    'local'   => [
        'paths' => [ '/', '/puntos-de-venta' ],
        'tags'  => [ 'locales' ],
    ],
];


/**
 * Llama al endpoint /api/revalidate del frontend Next.js cuando
 * se publica o actualiza un post de un CPT en el mapa anterior.
 *
 * @param int     $post_id ID del post guardado.
 * @param WP_Post $post    Objeto del post.
 * @param bool    $update  True si es actualización.
 */
function la_trigger_isr_revalidation( int $post_id, WP_Post $post, bool $update ): void {

    // Ignorar autoguardados y revisiones.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( wp_is_post_revision( $post_id ) )               return;

    // Solo actuar cuando el post pasa a "publish".
    if ( 'publish' !== $post->post_status ) return;

    // Solo actuar para CPTs definidos en el mapa.
    if ( ! array_key_exists( $post->post_type, LA_REVALIDATION_MAP ) ) return;

    // Verificar que las constantes están definidas en wp-config.php.
    if ( ! defined( 'LA_NEXTJS_URL' ) || ! defined( 'LA_REVALIDATE_SECRET' ) ) {
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        error_log( '[Loteria ISR] ERROR: LA_NEXTJS_URL o LA_REVALIDATE_SECRET no definidos en wp-config.php' );
        return;
    }

    $payload = wp_json_encode( LA_REVALIDATION_MAP[ $post->post_type ] );
    if ( false === $payload ) return;

    // URL construida dinámicamente — cambiar solo LA_NEXTJS_URL en wp-config.php
    // para pasar de staging a producción. Este archivo no se toca.
    $endpoint = rtrim( LA_NEXTJS_URL, '/' ) . '/api/revalidate';

    $response = wp_remote_post(
        $endpoint,
        [
            'timeout'     => 10,
            'redirection' => 0,
            'blocking'    => false,  // no bloquea la respuesta del admin
            'sslverify'   => true,   // verificar certificado SSL en producción
            'headers'     => [
                'Content-Type'        => 'application/json',
                'x-revalidate-secret' => LA_REVALIDATE_SECRET,
            ],
            'body'        => $payload,
        ]
    );

    if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        if ( is_wp_error( $response ) ) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log( sprintf(
                '[Loteria ISR] Fallo al revalidar post #%d (%s): %s',
                $post_id,
                $post->post_type,
                $response->get_error_message()
            ) );
        } else {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log( sprintf(
                '[Loteria ISR] Revalidación enviada — post #%d (%s) → %s',
                $post_id,
                $post->post_type,
                $endpoint
            ) );
        }
    }
}
add_action( 'save_post', 'la_trigger_isr_revalidation', 20, 3 );


/* ============================================================================
   §3 — CABECERAS DE SEGURIDAD HTTP
   Se aplican a las respuestas del admin, la página de login y la REST API.
   ============================================================================ */

function la_send_security_headers(): void {
    if ( headers_sent() ) return;

    header( 'X-Content-Type-Options: nosniff' );
    header( 'X-Frame-Options: DENY' );
    header( 'X-DNS-Prefetch-Control: on' );
    header( 'Referrer-Policy: strict-origin-when-cross-origin' );
    header( 'Permissions-Policy: camera=(), microphone=(), geolocation=()' );
    header_remove( 'X-Powered-By' );

    if ( is_ssl() ) {
        header( 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' );
    }
}
add_action( 'send_headers',  'la_send_security_headers' );
add_action( 'rest_api_init', static function () { la_send_security_headers(); }, 1 );
add_action( 'login_head',    'la_send_security_headers' );




