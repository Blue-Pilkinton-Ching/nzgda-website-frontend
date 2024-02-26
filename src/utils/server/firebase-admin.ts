import * as admin from 'firebase-admin'
import { config } from 'dotenv'

config()

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
  } catch (error) {
    console.error('Firebase admin initialization error', error)
  }
}
