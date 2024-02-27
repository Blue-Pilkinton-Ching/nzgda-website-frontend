import { NextRequest, NextResponse } from 'next/server'
import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'

import * as admin from 'firebase-admin'

import {
  DashboardBody,
  GamesListItem,
  UserPrivilege,
} from '../../../../../types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { gameID: string } }
) {
  const res = await getPrivilege(req)
  const gameChanges = await req.json()
  const privilege = res.headers.get('privilege') as UserPrivilege

  let body: DashboardBody | {} = {}
  let statusCode = 500

  if (privilege === 'admin') {
    try {
      const query = admin
        .firestore()
        .collection('games')
        .where('id', '==', Number(params.gameID))
        .limit(1)
      const query2 = admin.firestore().collection('gameslist').limit(1)

      let updateGame = async () => {
        let updateGame1 = async () => {
          await (await query.get()).docs[0].ref.update(gameChanges)
        }
        let updateGame2 = async () => {
          const doc = (await query2.get()).docs[0]
          const data = doc.data() as GamesListItem

          data.data[
            data.data.findIndex((item) => item.id === Number(params.gameID))
          ].name = gameChanges.name

          await doc.ref.set(data)
        }
        updateGame1()
        updateGame2()
      }

      await updateGame()

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
