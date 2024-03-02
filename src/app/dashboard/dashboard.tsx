'use client'
import { useEffect, useState } from 'react'
import { DashboardBody as DashboardData, Game } from '../../../types'
import Button from '../(components)/button'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import Users from './users'
import GamesList from './gameslist'
import EditGame from './editgame'

export default function Dashboard({
  data,
  invalidateData,
}: {
  data: DashboardData
  invalidateData: () => void
}) {
  const [user] = useAuthState(getAuth())
  const [game, setGame] = useState<Game>()

  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [panel, setPanel] = useState<'users' | 'games' | undefined>('games')

  useEffect(() => {
    setDashboardData(data)
  }, [data])

  async function exitGame() {
    invalidateData()
    setGame(undefined)
  }

  if (!dashboardData) {
    return (
      <div className="text-xl text-red font-semibold">Loading dashboard...</div>
    )
  }

  return (
    <>
      <div className="max-w-[600px] text-wrap mx-auto text-left mt-20 text-lg mb-12">
        <EditGame
          className={game ? 'block' : 'hidden'}
          game={game}
          exit={exitGame}
        ></EditGame>
        <div
          className={`border-collapse ${
            game == undefined ? 'block' : 'hidden'
          }`}
        >
          <div className="flex justify-center gap-10">
            <Button
              onClick={() => setPanel('games')}
              inverted={panel === 'users'}
            >
              Games
            </Button>
            <Button
              onClick={() => setPanel('users')}
              inverted={panel === 'games'}
            >
              Users & Settings
            </Button>
          </div>
          <br />
          <GamesList
            className={panel === 'games' ? 'block' : 'hidden'}
            games={dashboardData.gameslist.data}
            setGame={(game) => {
              setGame(game)
            }}
          ></GamesList>
          <Users
            className={panel === 'users' ? 'block' : 'hidden'}
            authRequests={dashboardData.authRequests}
          ></Users>
        </div>
      </div>
    </>
  )
}
