'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'

import { GameListItem, GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'

import '@/utils/client/firebase'

import charactors from '../../../public/images/game-characters.png'

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
          <Image
            quality={100}
            src={`https://placehold.co/506x400.jpg?text=${encodeURIComponent(
              feature.name
            )}`}
            alt="Placeholder"
            height={506}
            width={400}
          ></Image>
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
