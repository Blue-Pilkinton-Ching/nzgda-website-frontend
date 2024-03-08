'use client'

import { GamesList, Partner } from '../../../../types'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import * as firestore from 'firebase/firestore'

import GameForm from '../gameform'

export default function Page() {
  const [user] = useAuthState(getAuth())

  const [partners, setPartners] = useState<Partner[]>([])

  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user == null) {
      window.location.href = '/dashboard'
      return
    } else {
      fetchPartners()
    }

    async function fetchPartners() {
      let data
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
          setMessage("Couldn't find data :(")
          throw 'Partner data not on firebase for some reason'
        }
        setPartners(data?.partners)
      } catch (error) {
        console.error(error)
        setMessage('Failed to fetch games :(')
      }
    }
  })

  return (
    <>
      {message ? (
        <p>{message}</p>
      ) : (
        <GameForm edit={false} partners={partners} />
      )}
    </>
  )
}
