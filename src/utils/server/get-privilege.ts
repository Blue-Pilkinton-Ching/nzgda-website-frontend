import { NextRequest, NextResponse } from 'next/server'
import { DecodedIdToken } from 'firebase-admin/auth'
import * as admin from 'firebase-admin'
import { DashboardBody } from '../../../types'

export default async function getPrivilege(req: NextRequest) {
  const res = new NextResponse()

  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    res.headers.append('privilege', 'missing')
    return res
  }

  let credential: DecodedIdToken

  try {
    credential = await admin
      .auth()
      .verifyIdToken(authHeader.split('Bearer ')[1])
  } catch (error) {
    console.error(error)

    res.headers.append('privilege', 'invalid')
    return res
  }

  const adminData = (
    await admin.firestore().doc('users/privileged').get()
  ).data() as DashboardBody

  if (adminData == undefined) {
    console.error('adminData is undefined')
    res.headers.append('privilege', 'error')
    return res
  }

  const a = adminData.admins.find((x) => x.uid === credential.uid)

  if (a) {
    res.headers.append('privilege', 'admin')
    return res
  }

  res.headers.append('privilege', 'noprivilege')
  return res
}
