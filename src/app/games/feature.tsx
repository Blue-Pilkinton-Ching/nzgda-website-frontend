'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'

import { GameListItem, GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'

import '@/utils/client/firebase'

import urlName from '@/utils/client/get-url-friendly-name'

import charactors from '../../../public/images/game-characters.png'
import Link from 'next/link'

export default function Feature() {
  const [feature, setFeature] = useState<GameListItem>()

  useEffect(() => {
    const fetchGames = async () => {
      let data: GamesList
      try {
        data = (
          await firestore.getDoc(
            firestore.doc(
              firestore.getFirestore(),
              'gameslist/BrHoO8yuD3JdDFo8F2BC'
            )
          )
        ).data() as GamesList
        if (!data) {
          console.error('Data not on firebase for some reason')
          throw 'Data not on firebase for some reason'
        }
        setFeature(data.data.find((element) => element.featured))
      } catch (error) {
        console.error(error)
      }
    }

    fetchGames()
  }, [])
  if (feature) {
    const imageUrl = `https://placehold.co/506x400.jpg?text=${encodeURIComponent(
      feature.name
    )}`
    console.log(imageUrl) // To debug the actual URL being used
  }

  return (
    <>
      <Suspense
        fallback={
          <Image
            quality={75}
            src={charactors}
            alt="game-characters"
            width={400}
          ></Image>
        }
      >
        {feature ? (
          <Link
            href={`/game/${feature.id}/${urlName(feature.name)}`}
            className="hover:cursor-pointer"
          >
            <div className="relative hover:scale-[1.03] active:scale-100 duration-100">
              <Image
                quality={100}
                src={`https://placehold.co/506x400.jpg?text=Placeholder`}
                alt="Placeholder"
                height={506}
                width={400}
                className="shadow-md rounded-xl"
              ></Image>
              <div className="absolute w-full bottom-0 h-16 bg-gradient-to-t from-10% via-70% from-maingreen/80 via-maingreen/55 0 to-maingreen/0 rounded-b-lg">
                <div className="text-white translate-y-0.5 gap-1 flex text-center px-3 items-center justify-center w-full h-full my-auto text-xl">
                  <p className="font-thin">Featured</p>
                  <p className="font-semibold">Game</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Image
            quality={75}
            src={charactors}
            alt="game-characters"
            width={400}
          ></Image>
        )}
      </Suspense>
    </>
  )
}
