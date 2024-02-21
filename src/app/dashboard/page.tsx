'use client'

import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import Background from '../(components)/background'
import Button from '../(components)/button'
import { getAuth } from 'firebase/auth'
import { useEffect } from 'react'

import '../(utils)/firebase'
import Link from 'next/link'

export default function Page() {
  const [user, userLoading, userError] = useAuthState(getAuth())

  const [signOut, loading, signOutError] = useSignOut(getAuth())

  useEffect(() => {
    if (signOutError) {
      console.error(signOutError)
      alert(`An error occured while signing out. ${signOutError?.message}`)
    }
  }, [signOutError])

  return (
    <Background>
      {user ? (
        <Button onClick={signOut}>Logout</Button>
      ) : (
        <>
          <p className="text-2xl max-w-[800px] mx-auto font-semibold">
            You must be logged in to access the dashboard
          </p>
          <br />
          <Link href={'/login'}>
            <Button onClick={() => {}}>Go to Sign In</Button>
          </Link>
        </>
      )}
    </Background>
  )
}
