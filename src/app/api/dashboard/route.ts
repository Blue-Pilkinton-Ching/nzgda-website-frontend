import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'
import {
  Admin,
  AuthRequest,
  AdminDashboard,
  UserPrivilege,
  GamesList,
} from '../../../../types'
import * as admin from 'firebase-admin'

export async function GET(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  let body: AdminDashboard | {} = {}
  let statusCode = 500

  if (privilege === 'admin') {
    let admins
    let gameslist
    let authRequests
    let partners

    try {
      const func1 = async () => {
        const d = (
          await admin.firestore().doc('gameslist/BrHoO8yuD3JdDFo8F2BC').get()
        ).data() as GamesList

        gameslist = d.data
        partners = d.partners
      }

      const func2 = async () =>
        (authRequests = (
          await admin.firestore().collection('users/privileged/requests').get()
        ).docs.map((doc) => doc.data()) as AuthRequest[])

      const func3 = async () =>
        (admins = (
          await admin.firestore().doc('users/privileged').get()
        ).data() as Admin[])

      await Promise.all([func1(), func2(), func3()])

      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }

    body = { admins, gameslist, authRequests, partners }
  } else {
    statusCode = 401
  }

  return new NextResponse(JSON.stringify(body), {
    headers: res.headers,
    status: statusCode,
  })
}
