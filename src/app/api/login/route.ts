import { NextRequest } from 'next/server'

import { config } from 'dotenv'

config()

export async function GET(req: NextRequest) {
  console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)

  return new Response()
}
