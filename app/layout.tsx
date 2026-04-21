import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const gunterz = localFont({
  src: '../public/fonts/Gunterz-Bold.ttf',
  variable: '--font-gunterz',
  display: 'swap',
})

const resonate = localFont({
  src: '../public/fonts/Resonate-Regular.ttf',
  variable: '--font-resonate',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://loteriadeanimales.com.py'
const SITE_NAME = 'Lotería de Animales'
const SITE_DESCRIPTION =
  'La lotería de animales más emocionante de Paraguay. Resultados en vivo, predicciones con IA y premios increíbles.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Jugá y Ganá`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Jugá y Ganá`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Resultados, Palpites IA y Premios`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Jugá y Ganá`,
    description: SITE_DESCRIPTION,
    images: ['/images/og-default.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#1E2B3E',
}

// ─── JSON-LD: WebSite + Organization ────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'es-PY',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/resultados?fecha={fecha}`,
        },
        'query-input': 'required name=fecha',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
        width: 300,
        height: 90,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Asunción',
        addressCountry: 'PY',
      },
      sameAs: [], // Se llenarán con las URLs de RRSS cuando estén configuradas
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function clean(node) {
                  if (node.nodeType !== 1) return;
                  Array.from(node.attributes).forEach(function(attr) {
                    if (attr.name.startsWith('bis_')) node.removeAttribute(attr.name);
                  });
                }
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName.startsWith('bis_')) {
                      mutation.target.removeAttribute(mutation.attributeName);
                    }
                    mutation.addedNodes.forEach(function(node) { clean(node); });
                  });
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true
                });
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${gunterz.variable} ${resonate.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="la-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
