import { NextRequest, NextResponse } from 'next/server'
import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'

import * as admin from 'firebase-admin'

import {
  AdminDashboard,
  GameListItem,
  UserPrivilege,
} from '../../../../../../types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { gameID: string } }
) {
  const res = await getPrivilege(req)
  const hidden = (await req.json()).hidden as boolean
  const privilege = res.headers.get('privilege') as UserPrivilege

  let body: AdminDashboard | {} = {}
  let statusCode = 500

  if (privilege === 'admin') {
    try {
      const query = admin.firestore().collection('gameslist').limit(1)

      const doc = (await query.get()).docs[0]
      const data = doc.data() as { data: GameListItem[] }

      data.data[
        data.data.findIndex((item) => item.id === Number(params.gameID))
      ].hidden = hidden

      await doc.ref.set(data)

      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }
  } else {
    statusCode = 401
  }

  return new NextResponse(JSON.stringify(body), {
    headers: res.headers,
    status: statusCode,
  })
}
