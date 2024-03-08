'use client'

import Background from '../(components)/background'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import '../../utils/client/firebase'
import { useRouter } from 'next/navigation'
import NoAuth from './noauth'
import { useEffect, useState } from 'react'
import Button from '../(components)/button'
import TryAgain from './try-again'

import { AdminDashboard } from '@/../types'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, userLoading, userError] = useAuthState(getAuth())
  const [signOut, loading, signOutError] = useSignOut(getAuth())
  const [panel, setPanel] = useState<'admin' | 'noauth' | 'error' | ''>('')

  const [data, setData] = useState<AdminDashboard | null>(null)

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
        setPanel('admin')
        setData(await res.json())
        break
      case 401:
        setPanel('noauth')
        break
      case 500:
        setPanel('error')
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  return (
    <Background>
      {user ? (
        <>
          {panel === 'admin' ? (
            <>{children}</>
          ) : panel === 'noauth' ? (
            <NoAuth />
          ) : panel === 'error' ? (
            <TryAgain onButtonClick={fetchDashboardData} />
          ) : (
            <p className="text-xl font-bold">Loading...</p>
          )}
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
