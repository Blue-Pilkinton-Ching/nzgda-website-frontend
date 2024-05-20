'use client'

import { GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import '@/utils/client/firebase'
import Dropdown from '../(components)/dropdown'
import { useSearchParams } from 'next/navigation'
import GameSection from './gamesection'
import { IconButton } from '../(components)/iconButton'
import { IoSchool, IoSchoolOutline } from 'react-icons/io5'

export default function Games() {
  const [error, setError] = useState('')

  const [gamesData, setGamesData] = useState<GamesList>()
  const [partner, setPartner] = useState<string | null>()

  const [admin, setAdmin] = useState<boolean>()

  const [educational, setEducational] = useState(false)

  const params = useSearchParams()

  useEffect(() => {
    fetchGames()
    setPartner(params.get('partner'))
    setAdmin(params.get('admin') === 'true' || false)
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
              <GameSection
                smallTitle={`${partner}`}
                largeTitle={`${
                  educational ? 'Educational' : ''
                } Games by ${partner}`}
                titleChildren={
                  <div className="flex items-center gap-4">
                    <IconButton
                      onClick={() => {
                        setEducational(!educational)
                      }}
                    >
                      {educational ? (
                        <IoSchool
                          className="w-full"
                          size={'35px'}
                          color="#00A98F"
                        />
                      ) : (
                        <IoSchoolOutline
                          className="w-full"
                          size={'35px'}
                          color="#00A98F"
                        />
                      )}
                    </IconButton>
                    <Dropdown
                      options={gamesData.partners
                        .filter((x) => x.hidden !== true)
                        .map((x) => x.name)}
                    />
                  </div>
                }
                games={gamesData.data
                  .filter(
                    (x) =>
                      x.partner === partner &&
                      (admin ? true : x.approved === true) &&
                      (educational ? x.educational : true)
                  )
                  .sort(
                    (a, b) =>
                      (b.sort ? b.sort : b.id * 100) -
                      (a.sort ? a.sort : a.id * 100)
                  )}
              />
            </>
          ) : null}
          <br />
          <br />
          <br />
          <GameSection
            smallTitle={educational ? 'Educational Games' : 'Online Games'}
            largeTitle={
              educational ? 'Educational Online Games' : 'Play Games Online'
            }
            titleChildren={
              partner ? null : (
                <>
                  <div className="flex items-center gap-4">
                    <IconButton
                      onClick={() => {
                        setEducational(!educational)
                      }}
                    >
                      {educational ? (
                        <IoSchool
                          className="w-full"
                          size={'35px'}
                          color="#00A98F"
                        />
                      ) : (
                        <IoSchoolOutline
                          className="w-full"
                          size={'35px'}
                          color="#00A98F"
                        />
                      )}
                    </IconButton>
                    <Dropdown
                      options={gamesData.partners
                        .filter((x) => x.hidden !== true)
                        .map((x) => x.name)}
                    />
                  </div>
                </>
              )
            }
            games={gamesData.data
              .filter(
                (x) =>
                  (educational ? x.educational : true) &&
                  (admin ? true : x.approved === true)
              )
              .sort(
                (a, b) =>
                  (b.sort ? b.sort : b.id * 100) -
                  (a.sort ? a.sort : a.id * 100)
              )}
          />
          <br />
          <br />
          <br />
          {gamesData.data.filter(
            (x) => x.app && (educational ? x.educational : true)
          ).length === 0 ? null : (
            <GameSection
              smallTitle={educational ? 'Educational Apps' : 'Apps'}
              largeTitle={educational ? 'Educational Apps' : 'Download an App'}
              games={gamesData.data
                .filter(
                  (x) =>
                    x.app &&
                    (educational ? x.educational : true) &&
                    (admin ? true : x.approved === true)
                )
                .sort(
                  (a, b) =>
                    (b.sort ? b.sort : b.id * 100) -
                    (a.sort ? a.sort : a.id * 100)
                )}
            />
          )}
        </>
      ) : error ? (
        <p className=" text-maingreen text-3xl">Failed to fetch games :(</p>
      ) : (
        <p className="text-maingreen text-3xl">Fetching Games...</p>
      )}
    </>
  )
}
