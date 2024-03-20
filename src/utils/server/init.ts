import { config } from 'dotenv'

let hasInit = false

if (!hasInit) {
  hasInit = true
  config()
}

import './init-firebase-admin'
import './AWS'
