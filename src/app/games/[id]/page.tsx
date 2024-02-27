'use client'

import { useEffect, useRef, useState } from 'react'
import { Game, GameListItem } from '../../../../types'
import { useParams } from 'next/navigation'
import Image from 'next/image'

import logo from '../../../../public/images/heihei-logo-green.png'
import Link from 'next/link'

import google from '../../../../public/images/google-badge.svg'
import apple from '../../../../public/images/apple-badge.svg'

import back from '../../../../public/images/back.svg'
import { useRouter } from 'next/navigation'
import * as firestore from 'firebase/firestore'

export default function Page() {
  const [game, setGame] = useState<Game | null>()
  const [error, setError] = useState('')
  const gameView = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setFullscreen] = useState(false)

  const params = useParams<{ id: string }>()

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onFullscreenChange() {
    setFullscreen(document.fullscreenElement != null)
  }

  async function getData() {
    let game: Game

    const query = firestore.query(
      firestore.collection(firestore.getFirestore(), 'games'),
      firestore.where('id', '==', Number(params.id)),
      firestore.limit(1)
    )

    try {
      const snapshot = await firestore.getDocs(query)

      game = snapshot.docs[0].data() as Game
    } catch (error) {
      console.error(error)
      setError('Failed to fetch Game :(')
      return
    }

    setGame(game)
  }

  if (error) {
    return <p className="text-5xl font-semibold text-green">{error}</p>
  }

  if (!game) {
    return <p className="text-5xl font-semibold text-green">Fetching Game...</p>
  }

  return (
    <div className="flex flex-1 flex-col-reverse xl:flex-row justify-evenly items-center gap-10 *:max-w-[800px] *:xl:max-w-none min-h-[calc(100vh-80px)]">
      <div className="space-y-6 xl:min-w-[500px] xl:w-[500px] h-full flex justify-center flex-col">
        <h1 className="sm:text-4xl text-4xl text-green font-semibold text-wrap flex items-center">
          <Link
            className="hover:scale-125 active:scale-95 duration-100 hover:rotate-12 active:-rotate-12 flex items-center mr-5 w-full max-w-12"
            href={'/games'}
          >
            <Image src={back} alt={'back'}></Image>
          </Link>
          {game.name}
        </h1>
        <p className="sm:text-xl text-lg whitespace-pre-line">
          {game.description}
        </p>
        <div className="flex justify-center gap-8">
          {game.androidLink ? (
            <div>
              <Link href={game.androidLink} target="_blank">
                <Image
                  src={google}
                  alt={'Download on Android'}
                  className="pt-px"
                ></Image>
              </Link>
            </div>
          ) : (
            ''
          )}
          {game.iosLink ? (
            <div>
              <Link href={game.iosLink} target="_blank">
                <Image src={apple} alt={'Download on IOS'}></Image>
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        ref={gameView}
        style={{
          maxWidth: game.width,
          maxHeight: game.height && game.height < 800 ? game.height : 800,
        }}
        className="justify-center max-h-[800px] w-full xl:w-auto items-center aspect-video flex-grow relative flex flex-col box-content rounded-lg *:rounded-lg"
      >
        {game.url ? (
          <>
            <iframe
              src={game.url}
              allowFullScreen
              className="w-full h-full shadow-lg overflow-hidden"
              style={{ maxWidth: game.width, maxHeight: game.height }}
              scrolling="no"
              id="heihei-game"
              frameBorder={0}
            ></iframe>
            <div
              style={{ maxWidth: game.width }}
              className="w-full h-16 flex justify-between flex-row-reverse items-center px-3"
            >
              <button
                onClick={() => {
                  setFullscreen((old) => {
                    if (old) {
                      document.exitFullscreen()
                    } else {
                      gameView.current?.requestFullscreen()
                    }
                    return !old
                  })

                  gameView.current?.requestFullscreen()
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
                <p className="font-semibold text-white pt-0.5 ">
                  {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
                </p>
              </button>
              <div className="w-8 h-8 pb-9">
                <Image quality={10} src={logo} alt={'logo'}></Image>
              </div>
            </div>
          </>
        ) : game.screenshot ? (
          <div className="w-full h-full shadow-lg rounded-xl">
            <Image
              src={game.screenshot}
              quality={100}
              fill
              alt={'game visual'}
              className="w-full h-auto shadow-lg rounded-xl"
            ></Image>
          </div>
        ) : (
          <p className="text-5xl font-semibold text-green">
            Game doesn&apos;t exist!
          </p>
        )}
      </div>
    </div>
  )
}
