import { NextRequest } from 'next/server'

import { config } from 'dotenv'

import admin from '../../../utils/firebase-admin'

config()

export async function GET(req: NextRequest) {
  return new Response()
}
