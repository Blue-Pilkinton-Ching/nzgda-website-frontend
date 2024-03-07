'use client'

import { GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import '@/utils/client/firebase'
import { useWindowSize } from '@uidotdev/usehooks'
import Card from './card'

export default function Games() {
  const { width } = useWindowSize()

  const [error, setError] = useState('')

  const [gamesData, setGamesData] = useState<GamesList>()

  useEffect(() => {
    fetchGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchGames() {
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
      setGamesData({
        data: data.data.filter(
          (element) =>
            !element.hidden &&
            data.partners.find((p) => p.name === element.partner)?.hidden !==
              true &&
            (element.exclude
              ? isMobile()
                ? !element.exclude.includes('mobileweb')
                : !element.exclude.includes('desktop')
              : true)
        ),
        partners: data.partners,
      })
      if (!data) {
        console.error('Data not on firebase for some reason')
        throw 'Data not on firebase for some reason'
      }
    } catch (error) {
      console.error(error)
      setError('Failed to fetch games :(')
    }
  }

  const isMobile = () => {
    const userAgent = navigator.userAgent
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
  }

  const containerWidth = () => {
    const padding = (width as number) >= 640 ? 80 : 40

    return (width as number) - padding
  }

  const flexGap = () => {
    const cardWidth = (width as number) >= 1024 ? 150 : 135
    return (containerWidth() - cardsPerRow() * cardWidth) / (cardsPerRow() + 1)
  }

  const cardsPerRow = () => {
    const cardWidth = (width as number) >= 1024 ? 150 : 135
    const gap = (width as number) >= 1024 ? 12 : 8

    return Math.floor((containerWidth() + gap) / (cardWidth + gap))
  }

  return (
    <>
      {gamesData ? (
        <>
          <h3 className="text-3xl font-bold text-green">Play Games online</h3>
          <br />
          <div
            className="flex justify-evenly lg:gap-x-3 gap-x-2 flex-wrap"
            style={
              typeof window !== 'undefined' && width
                ? { rowGap: flexGap() }
                : {}
            }
          >
            {gamesData.data.map((element) => (
              <Card key={element.id} game={element} />
            ))}
            {gamesData.data.length % cardsPerRow() !== 0
              ? Array(cardsPerRow() - (gamesData.data.length % cardsPerRow()))
                  .fill(0)
                  .map((_, i) => (
                    <div
                      className={`lg:w-[150px] w-[135px] h-[180px] lg:h-[200px]`}
                      key={i}
                    ></div>
                  ))
              : null}
          </div>
          <br />
          <br />
          <br />
          <h3 className="text-3xl font-bold text-green">Or download an app</h3>
          <br />
          <div
            className="flex justify-evenly lg:gap-x-3 gap-x-2 flex-wrap"
            style={
              typeof window !== 'undefined' && width
                ? { rowGap: flexGap() }
                : {}
            }
          >
            {gamesData.data
              .filter((x) => x.app)
              .map((element) => (
                <Card key={element.id} game={element} />
              ))}
            {gamesData.data.filter((x) => x.app).length % cardsPerRow() !== 0
              ? Array(
                  cardsPerRow() -
                    (gamesData.data.filter((x) => x.app).length % cardsPerRow())
                )
                  .fill(0)
                  .map((_, i) => (
                    <div
                      className={`lg:w-[150px] w-[135px] h-[180px] lg:h-[200px]`}
                      key={i}
                    ></div>
                  ))
              : null}
          </div>
        </>
      ) : error ? (
        <p className=" text-green text-3xl">Failed to fetch games :(</p>
      ) : (
        <p className="text-green text-3xl">Fetching Games...</p>
      )}
    </>
  )
}
