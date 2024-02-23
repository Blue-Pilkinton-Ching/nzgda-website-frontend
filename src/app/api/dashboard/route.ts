import admin from '../../../utils/firebase-admin'
import { config } from 'dotenv'
import { NextRequest, userAgent } from 'next/server'
import { AdminData } from '../../../../interfaces'
import { DecodedIdToken } from 'firebase-admin/auth'

config()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    return new Response('Authorization Header was not present', { status: 401 })
  }

  let credential: DecodedIdToken

  try {
    credential = await admin
      .auth()
      .verifyIdToken(authHeader.split('Bearer ')[1])
  } catch (error) {
    console.error(error)
    return new Response('Error Verifying Token', { status: 401 })
  }

  const adminData = (
    await admin.firestore().doc('users/privileged').get()
  ).data() as AdminData

  if (adminData == undefined) {
    console.error('adminData is undefined')
    return new Response('', { status: 500 })
  }

  const a = adminData.admins.find((x) => x.uid === credential.uid)

  if (a) {
    return new Response('', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
