'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { AdminDashboard } from '../../../types'
import Dashboard from './dashboard'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export default function Page() {
  const [user] = useAuthState(getAuth())

  const [data, setData] = useState<AdminDashboard | null>(null)

  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + (await user?.getIdToken(true)),
          'Content-Type': 'application/json',
        },
      })

      switch (res.status) {
        case 200:
          setAdmin(res.headers.get('privilege') === 'admin')
          setData(await res.json())
          break
        case 401:
          alert(`You are not authorized to access this page.`)
          break
        default:
          alert(`An error occured while fetching dashboard data.`)
          break
      }
    } catch (error) {
      console.error(error)
      alert(`An error occured while fetching dashboard data.`)
    }
  }

  return (
    <>
      {data ? (
        <Dashboard
          data={data}
          admin={admin}
          invalidateData={fetchDashboardData}
        />
      ) : (
        <p className="text-xl font-semibold my-5">Loading dashboard...</p>
      )}
    </>
  )
}
