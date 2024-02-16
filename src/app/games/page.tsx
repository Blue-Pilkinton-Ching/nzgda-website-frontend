import Image from 'next/image'

import charactors from '../../../public/images/game-characters.png'
import logo from '../../../public/images/game-logo.png'
import React, { Suspense } from 'react'
import { GamesList } from '../../../interfaces'

export default function Page() {
  return (
    <>
      <section className="flex justify-between items-center">
        <div>
          <div className="lg:w-[350px] min-w-[240px] w-[65%]">
            <Image quality={100} src={logo} alt="game-characters"></Image>
          </div>
          <br />
          <p className="lg:max-w-[500px] sm:max-w-[350px] lg:text-lg">
            Play, laugh, and learn! HEIHEI tākaro is a safe place for our
            tamariki. Watch shows on TVNZ On Demand, or Play games right here.
          </p>
        </div>
        <div className="xl:mr-44 lg:mr-[6%] my-16 hidden sm:block">
          <Image
            quality={75}
            src={charactors}
            alt="game-characters"
            width={400}
          ></Image>
        </div>
      </section>
      <section>
        <h3 className="text-3xl font-bold text-green">Games</h3>
        <Suspense fallback={<p className="text-lg">Fetching Games...</p>}>
          <Games />
        </Suspense>
      </section>
    </>
  )
}

async function Games() {
  const res: Response = await fetch(
    'https://heihei-server.gamefroot.com/games/?approved=1&parent=0&%24sort%5BcreatedAt%5D=-1'
  )

  if (!res.ok) {
    return <p className="text-lg">Failed to fetch Games :(</p>
  }

  const data: GamesList = await res.json()

  return (
    <>
      <br />
      <div className="flex ls:justify-between justify-evenly lg:gap-6 gap-3 flex-wrap">
        {data.data.map((element, index) => {
          return (
            <div
              key={index}
              className="w-[150px] h-[200px] flex shadow-md hover:cursor-pointer hover:scale-105 duration-100 active:scale-100"
            >
              <Image
                src={element.thumbnail}
                alt={element.name}
                width={150}
                height={200}
                className="rounded-lg"
              ></Image>
            </div>
          )
        })}
      </div>
    </>
  )
}
