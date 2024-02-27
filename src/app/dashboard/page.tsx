'use client'

import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import Background from '../(components)/background'
import Button from '../(components)/button'
import { User, getAuth } from 'firebase/auth'
import React, { use, useEffect, useState } from 'react'

import '../../utils/client/firebase'
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
        fetchDashboardData()
      } else {
        router.push('/register')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  useEffect(() => {
    console.log(user)

    if (user && user.uid !== uid) {
      setUID(user.uid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchDashboardData() {
    const res = await fetch('/api/dashboard', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await user?.getIdToken(true)),
        'Content-Type': 'application/json',
      },
    })

    switch (res.status) {
      case 200:
        setDashboard(
          <Dashboard
            data={await res.json()}
            invalidateData={fetchDashboardData}
          />
        )
        break
      case 401:
        setDashboard(<NoAuth />)
        break
      case 500:
        setDashboard(<TryAgain onButtonClick={fetchDashboardData} />)
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

function TryAgain({ onButtonClick }: { onButtonClick: () => void }) {
  return <Button onClick={onButtonClick}>Try Again</Button>
}
