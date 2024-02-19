'use client'

import { Suspense, useState } from 'react'
import { GamesList } from '../../../../interfaces'
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: { name: string } }) {
  return (
    <>
      <Suspense
        fallback={
          <p className="text-5xl font-semibold text-green">Fetching Game...</p>
        }
      >
        <GamePage name={decodeURIComponent(params.name)} />
      </Suspense>
    </>
  )
}

async function GamePage({ name }: { name: string }) {
  const res: Response = await fetch(
    'https://heihei-server.gamefroot.com/games/?approved=1&parent=0&%24sort%5BcreatedAt%5D=-1'
  )

  if (!res.ok) {
    return <p className="text-lg">Failed to fetch Games :(</p>
  }

  const data: GamesList = await res.json()
  const game = data.data.find((x) => x.name === name)

  if (!game) {
    return notFound()
  }

  return (
    <>
      <div className="flex flex-row justify-between gap-10">
        <div className="space-y-6 min-w-[400px] w-[400px] h-full">
          <h1 className="text-5xl text-green font-semibold">{game.name}</h1>
          <p className="text-xl whitespace-pre-line">{game.description}</p>
        </div>
        <div className="flex flex-col flex-grow h-full max-h-[800px] box-content aspect-video rounded-lg *:rounded-lg ">
          {game.url ? (
            <>
              <iframe
                src={game.url}
                allowFullScreen
                className="w-full h-full shadow-lg overflow-hidden float-right"
                scrolling="no"
                id="heihei-game"
              ></iframe>
              <div className="w-full h-16 flex justify-between flex-row-reverse items-center">
                <button
                  onClick={() => {
                    document.getElementById('heihei-game')?.requestFullscreen()
                  }}
                  className="flex bg-green h-9 w-40 rounded-full items-center justify-center hover:scale-105 duration-100 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="-pl-0.5 w-7 h-7"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                  </svg>
                  <p className="font-semibold text-white pt-0.5 ">FULLSCREEN</p>
                </button>
              </div>
            </>
          ) : (
            <div>Game doesn&apos;t exist!</div>
          )}
        </div>
      </div>
    </>
  )
}
