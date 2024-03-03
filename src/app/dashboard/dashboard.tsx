'use client'
import { useEffect, useState } from 'react'
import { AdminDashboard as DashboardData, Game } from '../../../types'
import Button from '../(components)/button'
import Users from './users'
import GamesList from './gameslist'
import EditGame from './editgame'
import Partners from './partners'

export default function Dashboard({
  data,
  invalidateData,
}: {
  data: DashboardData
  invalidateData: () => void
}) {
  const [game, setGame] = useState<Game>()

  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [panel, setPanel] = useState<'users' | 'games' | 'partners'>('games')

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
      <div className="max-w-[600px] text-wrap mx-auto text-left mt-20 text-lg mb-12 font-sans text-black">
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
          <br />
          <GamesList
            className={`${
              panel === 'games' ? 'block' : 'hidden'
            } shadow-lg p-4 rounded`}
            games={dashboardData.gameslist}
            setGame={(game) => {
              setGame(game)
            }}
          ></GamesList>
          <Users
            className={`${
              panel === 'users' ? 'block' : 'hidden'
            } shadow-lg p-4 rounded`}
            authRequests={dashboardData.authRequests}
          ></Users>
          <Partners
            partners={dashboardData.partners}
            className={`${
              panel === 'partners' ? 'block' : 'hidden'
            } shadow-lg p-4 rounded`}
          ></Partners>
        </div>
      </div>
    </>
  )
}
