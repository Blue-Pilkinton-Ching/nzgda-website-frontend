import Image from 'next/image'

import charactors from '../../../public/images/game-characters.png'
import logo from '../../../public/images/game-logo.png'
import { GamesListItem } from '../../../types'

import ispy from '../../../public/images/I-Spyportrait.png'
import Link from 'next/link'
import { Suspense } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import * as firestore from 'firebase/firestore'
import { signIn } from '@/utils/client/init'

export default function Page() {
  return (
    <>
      <section className="flex justify-between items-center">
        <div>
          <div className="lg:w-[350px] min-w-[240px] w-[65%]">
            <Image quality={100} src={logo} alt="game-characters"></Image>
          </div>
          <br />
          <p className="lg:max-w-[500px] sm:max-w-[350px] lg:text-lg mb-5 sm:mb-0">
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
        <Suspense
          fallback={
            <>
              <br />
              <p className=" text-green text-3xl">Fetching Games...</p>
            </>
          }
        >
          <Games />
        </Suspense>
      </section>
    </>
  )
}

async function Games() {
  let data
  try {
    await signIn()
    data = (
      await firestore.getDoc(
        firestore.doc(
          firestore.getFirestore(),
          'gameslist/BrHoO8yuD3JdDFo8F2BC'
        )
      )
    ).data() as { data: GamesListItem[] }
    if (!data) {
      console.error('Data not on firebase for some reason')
      throw 'Data not on firebase for some reason'
    }
  } catch (error) {
    console.error(error)
    return <p className="text-lg">Failed to fetch game :(</p>
  }

  return (
    <>
      <br />
      <div className="flex justify-evenly lg:gap-6 gap-3 flex-wrap">
        {data.data.map((element, index) => {
          const thumbnail = element.name === 'I_SPY' ? ispy : element.thumbnail

          return (
            <Link key={index} href={`/games/${element.id}`}>
              <div className="rounded-lg max-w-[150px] h-[200px] flex shadow-md hover:cursor-pointer hover:scale-105 duration-100 active:scale-95">
                <Image
                  src={thumbnail}
                  alt={element.name}
                  width={150}
                  height={200}
                  className="rounded-lg "
                ></Image>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
