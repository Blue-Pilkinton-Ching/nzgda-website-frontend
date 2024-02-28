'use client'

import Button from '../(components)/button'
import '@/utils/client/firebase'
import { getAuth } from 'firebase/auth'
import * as firestore from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function NoAuth() {
  const [user] = useAuthState(getAuth())

  async function requestAuthorisation(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.currentTarget.disabled = true

    const doc = firestore.doc(
      firestore.getFirestore(),
      `users/privileged/requests/${user?.uid}`
    )
    try {
      if (user == null || !user.emailVerified) {
        throw new Error('User not verified or not logged in!')
      }

      await firestore.setDoc(doc, { email: user.email, uid: user.uid })
    } catch (error) {
      console.error(error)
      alert(error)
      return
    }

    alert('Authorisation request sent!')
  }

  return (
    <>
      <Button onClick={requestAuthorisation}>Request Authorisation</Button>
      <br />
      <br />
    </>
  )
}
