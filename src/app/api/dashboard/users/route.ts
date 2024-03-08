import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'
import { User, UserPrivilege, UserTypes } from '../../../../../types'
import * as admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  const reqBody = (await req.json()) as { user: User }

  let statusCode = 500

  if (privilege === 'admin') {
    try {
      const func1 = async () => {
        const d = (
          await admin.firestore().doc('users/privileged').get()
        ).data() as UserTypes

        d.privileged.push(reqBody.user)

        await admin.firestore().doc('users/privileged').set(d)

        await (
          await admin
            .firestore()
            .collection('users/privileged/requests')
            .limit(1)
            .where('uid', '==', reqBody.user.uid)
            .get()
        ).docs[0].ref.delete()
      }

      func1()

      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }
  } else {
    statusCode = 401
  }

  return new NextResponse('', {
    headers: res.headers,
    status: statusCode,
  })
}

export async function DELETE(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  const reqBody = (await req.json()) as { user: User }

  let statusCode = 500

  if (privilege === 'admin') {
    try {
      const func1 = async () => {
        const d = (
          await admin.firestore().doc('users/privileged').get()
        ).data() as UserTypes

        d.privileged = d.privileged.filter((x) => x.uid !== reqBody.user.uid)

        await admin.firestore().doc('users/privileged').set(d)
      }

      func1()

      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }
  } else {
    statusCode = 401
  }

  return new NextResponse('', {
    headers: res.headers,
    status: statusCode,
  })
}
