import { NextRequest } from 'next/server'

import { config } from 'dotenv'

import admin from '../../../utils/firebase-admin'
import { headers } from 'next/headers'

config()

export async function GET(req: NextRequest) {
  const headersList = headers()

  const auth = headersList.get('Authorization')

  if (!auth) {
    return new Response('Authorization Header was not present', { status: 401 })
  }

  const token = auth.split('Bearer ')[1]

  try {
    const verification = await admin.auth().verifyIdToken(token)
    const body = JSON.stringify(verification)

    return new Response(body, { status: 200 })
  } catch (error) {
    return new Response('Error Verifying Token', { status: 401 })
  }
}
