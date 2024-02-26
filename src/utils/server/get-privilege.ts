import { NextRequest } from 'next/server'
import { DecodedIdToken } from 'firebase-admin/auth'
import * as admin from 'firebase-admin'
import { AdminData } from '../../../types'

export default async function getPrivilege(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    req.headers.append('privilege', 'missing')
    return req
  }

  let credential: DecodedIdToken

  try {
    credential = await admin
      .auth()
      .verifyIdToken(authHeader.split('Bearer ')[1])
  } catch (error) {
    console.error(error)

    req.headers.append('privilege', 'invalid')
    return req
  }

  const adminData = (
    await admin.firestore().doc('users/privileged').get()
  ).data() as AdminData

  if (adminData == undefined) {
    console.error('adminData is undefined')
    req.headers.append('privilege', 'error')
    return req
  }

  const a = adminData.admins.find((x) => x.uid === credential.uid)

  if (a) {
    req.headers.append('privilege', 'admin')
    return req
  }

  req.headers.append('privilege', 'noprivilege')
  return req
}
