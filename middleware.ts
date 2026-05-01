import { NextRequest, NextResponse } from 'next/server'

const TRACKING_PARAMS = [
  'fbclid', 'gclid', 'gad_source', 'gbraid', 'wbraid',
  'ttclid', 'twclid', 'msclkid', 'mc_eid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  '_ga', '_gl', 'ref', 'igshid',
]

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  let changed = false

  for (const param of TRACKING_PARAMS) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      changed = true
    }
  }

  if (changed) return NextResponse.redirect(url, { status: 301 })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
