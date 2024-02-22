'use client'

import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import Background from '../(components)/background'
import Button from '../(components)/button'
import { User, getAuth } from 'firebase/auth'
import React, { Suspense, use, useEffect, useState } from 'react'

import '../(utils)/firebase'
import { useRouter } from 'next/navigation'
import Dashboard from './dashboard'
import NoAuth from './noauth'

export default function Page() {
  const [user, userLoading, userError] = useAuthState(getAuth())
  const [signOut, loading, signOutError] = useSignOut(getAuth())
  const [dashboard, setDashboard] = useState<React.ReactNode>()

  const [uid, setUID] = useState('')

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

  useEffect(() => {
    if (uid && user) {
      if (user.emailVerified) {
        getDashboardLoggedIn(user)
      } else {
        router.push('/register')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  useEffect(() => {
    if (user && user.uid !== uid) {
      setUID(user.uid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function getDashboardLoggedIn(user: User) {
    const res = await fetch('/api/dashboard', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await user.getIdToken(true)),
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      // You are an admin
      setDashboard(<Dashboard data={await res.json()} />)
    } else if (res.status === 401) {
      // You need to be an admin
      setDashboard(<NoAuth />)
    } else {
      // Server / Network Error
      console.error(res)
      alert(
        'Something went wrong fetching the dashboard. Please try again later.'
      )
    }
  }

  return (
    <Background>
      {user ? (
        <>
          {dashboard}
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
