import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/api/dashboard/:path*'],
}

export default function myMiddleware(request: NextRequest) {
  console.log('went thru middle ware')
  return NextResponse.next()
}
