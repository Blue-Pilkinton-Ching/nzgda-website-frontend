'use client'

import { GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import '@/utils/client/firebase'
import Dropdown from '../(components)/dropdown'
import { useSearchParams } from 'next/navigation'
import GameSection from './gamesection'

export default function Games() {
  const [error, setError] = useState('')

  const [gamesData, setGamesData] = useState<GamesList>()
  const [partner, setPartner] = useState<string | null>()

  const params = useSearchParams()

  useEffect(() => {
    fetchGames()
    setPartner(params.get('partner'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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

  return (
    <>
      {gamesData ? (
        <>
          {partner ? (
            <>
              <div className="flex justify-between sm:items-center gap-0 sm:gap-3 flex-col-reverse sm:flex-row">
                <h3 className="text-3xl font-bold text-maingreen">
                  Games by {partner}
                </h3>
                <br />
                <Dropdown
                  options={gamesData.partners
                    .filter((x) => x.hidden !== true)
                    .map((x) => x.name)}
                />
              </div>
              <br />
              <GameSection
                games={gamesData.data.filter((x) => x.partner === partner)}
              />
              <br />
              <br />
            </>
          ) : null}
          <div className="flex justify-between gap-3 items-center">
            <h3 className="text-3xl font-bold sm:hidden text-maingreen">
              Games
            </h3>
            <h3 className="text-3xl font-bold hidden sm:block text-maingreen">
              Play Games online
            </h3>
            {partner ? null : (
              <Dropdown
                options={gamesData.partners
                  .filter((x) => x.hidden !== true)
                  .map((x) => x.name)}
              />
            )}
          </div>
          <br />
          <GameSection games={gamesData.data} />
          <br />
          <br />
          <br />
          <h3 className="text-3xl font-bold sm:hidden text-maingreen">Apps</h3>
          <h3 className="text-3xl font-bold hidden sm:block text-maingreen">
            Or download an App
          </h3>
          <br />
          <GameSection games={gamesData.data.filter((x) => x.app)} />
        </>
      ) : error ? (
        <p className=" text-maingreen text-3xl">Failed to fetch games :(</p>
      ) : (
        <p className="text-maingreen text-3xl">Fetching Games...</p>
      )}
    </>
  )
}
