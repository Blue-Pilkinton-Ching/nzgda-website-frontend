import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'
import { Admin, DashboardBody, UserPrivilege } from '../../../../types'
import * as admin from 'firebase-admin'

export async function GET(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  let body: DashboardBody | {} = {}
  let statusCode = 500

  if (privilege === 'admin') {
    let admins

    try {
      admins = (
        await admin.firestore().doc('users/privileged').get()
      ).data() as Admin[]
      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }

    body = { admins }
  } else {
    statusCode = 401
  }

  return new NextResponse(JSON.stringify(body), {
    headers: res.headers,
    status: statusCode,
  })
}
