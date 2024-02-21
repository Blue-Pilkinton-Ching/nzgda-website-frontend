'use client'

import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import Background from '../(components)/background'
import Button from '../(components)/button'
import { getAuth } from 'firebase/auth'
import { Suspense, useEffect } from 'react'

import '../(utils)/firebase'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [user, userLoading, userError] = useAuthState(getAuth())

  const [signOut, loading, signOutError] = useSignOut(getAuth())

  const router = useRouter()

  useEffect(() => {
    if (signOutError) {
      console.error(signOutError)
      alert(`An error occured while signing out. ${signOutError?.message}`)
    }
  }, [signOutError])

  useEffect(() => {
    if (userError) {
      console.error(userError)
      alert(`An error occured while fetching user. ${userError?.message}`)
    }
  }, [userError?.message, userError])

  return (
    <Background>
      {user ? (
        <>
          <Suspense fallback={<></>}></Suspense>
          <Button onClick={signOut}>Logout</Button>
        </>
      ) : (
        <>
          <p className="text-2xl max-w-[800px] mx-auto font-semibold">
            You must be logged in to access the dashboard
          </p>
          <br />
          <Button
            onClick={() => {
              router.push('login')
            }}
          >
            Go to Sign In
          </Button>
        </>
      )}
    </Background>
  )
}
