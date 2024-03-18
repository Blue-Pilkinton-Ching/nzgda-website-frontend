import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'
import {
  AdminDashboard,
  UserPrivilege,
  GamesList,
  Game,
} from '../../../../../types'
import * as admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  const game = (await req.json()) as Game

  let body: AdminDashboard | {} = {}
  let statusCode = 500

  if (privilege === 'admin' || privilege === 'privileged') {
    const latestID = (
      await admin.firestore().doc('gameslist/latest-id').get()
    ).data() as { id: number }

    latestID.id += 1

    try {
      await admin.firestore().doc('gameslist/latest-id').set({ latestID })
    } catch (error) {
      console.error(error)
      statusCode = 500
      return new NextResponse('', {
        headers: res.headers,
        status: statusCode,
      })
    }

    const id = latestID.id

    if (privilege === 'admin') {
      try {
        const func1 = async () => {
          const d = (
            await admin.firestore().doc('gameslist/BrHoO8yuD3JdDFo8F2BC').get()
          ).data() as GamesList

          d.data.push({
            app: game.displayAppBadge,
            id,
            hidden: false,
            exclude: game.exclude || '',
            name: game.name,
            partner: game.partner,
            thumbnail: '',
            featured: false,
            // banner: "NEED TO IMPLEMENT",
          })

          await admin.firestore().doc(`gameslist/BrHoO8yuD3JdDFo8F2BC`).set(d)
        }

        const func2 = async () => {
          admin
            .firestore()
            .doc(`games/${id}`)
            .set({ ...game, id: id })
        }

        await Promise.all([func1(), func2()])

        statusCode = 200
      } catch (error) {
        console.error(error)
        statusCode = 500
      }
    }
  } else {
    statusCode = 401
  }

  return new NextResponse(JSON.stringify(body), {
    headers: res.headers,
    status: statusCode,
  })
}
