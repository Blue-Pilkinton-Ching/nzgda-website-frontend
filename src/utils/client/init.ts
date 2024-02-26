let hasInit = false

if (!hasInit) {
  hasInit = true
  signIn()
}

export async function signIn() {
  if (getAuth().currentUser) {
    return getAuth().currentUser
  } else {
    let user
    try {
      user = await signInAnonymously(getAuth())
    } catch (error) {
      console.error(error)
      signIn()
    }
    return user
  }
}

import { getAuth, signInAnonymously } from 'firebase/auth'
import './firebase'
