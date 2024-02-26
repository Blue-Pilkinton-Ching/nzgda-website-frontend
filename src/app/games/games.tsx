'use client'

import { GamesListItem } from '../../../types'

import ispy from '../../../public/images/I-Spyportrait.png'
import Link from 'next/link'
import Image from 'next/image'
import * as firestore from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import '@/utils/client/firebase'

export default function Games() {
  const [games, setGames] = useState<React.ReactNode>(null)

  useEffect(() => {
    fetchGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchGames() {
    let data
    try {
      data = (
        await firestore.getDoc(
          firestore.doc(
            firestore.getFirestore(),
            'gameslist/BrHoO8yuD3JdDFo8F2BC'
          )
        )
      ).data() as { data: GamesListItem[] }

      setGames(
        <div className="flex justify-evenly lg:gap-6 gap-3 flex-wrap">
          {data.data.map((element, index) => {
            const thumbnail =
              element.name === 'I_SPY' ? ispy : element.thumbnail

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
      )
      if (!data) {
        console.error('Data not on firebase for some reason')
        throw 'Data not on firebase for some reason'
      }
    } catch (error) {
      console.error(error)
      setGames(<p className=" text-green text-3xl">Failed to fetch game :(</p>)
    }
  }

  return (
    <>
      <br />
      {games ? (
        games
      ) : (
        <p className="text-green text-3xl">Failed to fetch game :(</p>
      )}
    </>
  )
}
