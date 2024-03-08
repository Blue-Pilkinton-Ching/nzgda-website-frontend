import getPrivilege from '@/utils/server/get-privilege'
import { NextRequest, NextResponse } from 'next/server'
import { User, UserPrivilege } from '../../../../../types'
import * as admin from 'firebase-admin'

export async function DELETE(req: NextRequest) {
  const res = await getPrivilege(req)
  const privilege = res.headers.get('privilege') as UserPrivilege
  const reqBody = (await req.json()) as { user: User }
  let statusCode = 500
  if (privilege === 'admin') {
    try {
      const updateData = async () => {
        const query = admin
          .firestore()
          .collection('users/privileged/requests')
          .limit(1)
          .where('uid', '==', reqBody.user.uid)
        await (await query.get()).docs[0].ref.delete()
      }
      await updateData()
      statusCode = 200
    } catch (error) {
      console.error(error)
      statusCode = 500
    }
  } else {
    statusCode = 401
  }
  return new NextResponse(JSON.stringify({}), {
    headers: res.headers,
    status: statusCode,
  })
}
