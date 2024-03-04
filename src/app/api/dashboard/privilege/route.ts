import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'
import { UserPrivilege } from '../../../../../types'

export async function GET(req: NextRequest) {
  const res = await getPrivilege(req)

  const privilege = res.headers.get('privilege') as UserPrivilege

  return new NextResponse(JSON.stringify(privilege), {
    headers: res.headers,
  })
}
