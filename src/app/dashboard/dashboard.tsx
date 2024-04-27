'use client'
import { useEffect, useState } from 'react'
import { AdminDashboard as DashboardData, GameListItem } from '../../../types'
import Button from '../(components)/button'
import Users from './users'
import GamesList from './gameslist'
import Partners from './partners'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import '@/utils/client/firebase'

export default function Dashboard({
  data,
  invalidateData,
  admin,
}: {
  admin: boolean
  data: DashboardData
  invalidateData: () => void
}) {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [panel, setPanel] = useState<'users' | 'games' | 'partners'>('games')

  const [user] = useAuthState(getAuth())

  useEffect(() => {
    setDashboardData(data)
  }, [data])

  if (!dashboardData) {
    return (
      <div className="text-xl text-mainred font-semibold">
        Loading dashboard...
      </div>
    )
  }

  //   console.log(dashboardData.gameslist)
  //   console.log(
  //     dashboardData.gameslist.filter(
  //       (x) =>
  //         (x.hidden === false || x.hidden === undefined) &&
  //         x.approved === true &&
  //         (admin
  //           ? true
  //           : x.partner ===
  //             data.users.privileged.find((u) => u.uid === user?.uid)?.partner)
  //     )
  //   )

  return (
    <>
      <div className="max-w-[800px] text-wrap mx-auto text-left mt-20 text-lg mb-12 font-sans text-black">
        {admin ? (
          <div className="flex justify-center gap-10">
            <Button
              onClick={() => setPanel('games')}
              inverted={panel !== 'games'}
              className="bg-black text-white"
              invertedClassName="bg-white text-black"
            >
              Games
            </Button>
            <Button
              onClick={() => setPanel('users')}
              inverted={panel !== 'users'}
              className="bg-black text-white"
              invertedClassName="bg-white text-black"
            >
              Users & Settings
            </Button>
            <Button
              onClick={() => setPanel('partners')}
              inverted={panel !== 'partners'}
              className="bg-black text-white"
              invertedClassName="bg-white text-black"
            >
              Partners
            </Button>
          </div>
        ) : null}
        <br />
        <GamesList
          invalidateGames={invalidateData}
          className={`${
            panel === 'games' ? 'block' : 'hidden'
          } shadow-lg p-4 rounded`}
          admin={admin}
          games={dashboardData.gameslist
            .filter(
              (x) =>
                (x.hidden === false || x.hidden === undefined) &&
                x.approved === true &&
                (admin
                  ? true
                  : x.partner ===
                    data.users.privileged.find((u) => u.uid === user?.uid)
                      ?.partner)
            )
            .sort((a, b) => b.id - a.id)}
          hiddenGames={dashboardData.gameslist.filter((x) => x.hidden)}
          unApprovedGames={
            admin
              ? dashboardData.gameslist.filter(
                  (x) => x.approved === false || x.approved === undefined
                )
              : undefined
          }
        ></GamesList>
        {admin ? (
          <>
            <Users
              invalidateUsers={invalidateData}
              partners={dashboardData.partners}
              users={dashboardData.users}
              className={`${
                panel === 'users' ? 'block' : 'hidden'
              } shadow-lg p-4 rounded`}
              authRequests={dashboardData.authRequests}
            ></Users>
            <Partners
              invalidatePartners={invalidateData}
              partners={dashboardData.partners}
              className={`${
                panel === 'partners' ? 'block' : 'hidden'
              } shadow-lg p-4 rounded`}
            ></Partners>
          </>
        ) : null}
      </div>
    </>
  )
}
