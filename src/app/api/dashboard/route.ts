import admin from '../../../utils/firebase-admin'
import * as fs from 'firebase/firestore'
import { config } from 'dotenv'
import { NextRequest } from 'next/server'

config()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    return new Response('Authorization Header was not present', { status: 401 })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    await admin.auth().verifyIdToken(token)
  } catch (error) {
    console.error(error)
    return new Response('Error Verifying Token', { status: 401 })
  }

  const query = await admin.firestore().collection('users').limit(50).get()

  const data = query.docs.map((doc) => doc.data())

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
