import { NextRequest, NextResponse } from 'next/server'

import '@/utils/server/init'
import getPrivilege from '@/utils/server/get-privilege'

export async function GET(req: NextRequest) {
  req = await getPrivilege(req)
  console.log(req.headers)
  return new NextResponse()
}
