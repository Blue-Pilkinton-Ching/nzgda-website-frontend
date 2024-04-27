'use client'

import { Game, GamesList, Partner, UserTypes } from '../../../../../types'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import '@/utils/client/firebase'

import { useParams } from 'next/navigation'
import * as firestore from 'firebase/firestore'
import GameForm from '../../gameform'

export default function EditGame() {
  const [user] = useAuthState(getAuth())

  const [message, setMessage] = useState('Loading Game...')

  const [game, setGame] = useState<Game>()
  const [partners, setPartners] = useState<Partner[]>([])

  const [users, setUsers] = useState<UserTypes>()

  const params = useParams<{ id: string }>()

  useEffect(() => {
    if (user == null) {
      window.location.href = '/dashboard'
      return
    } else {
      Promise.all([fetchGame(), fetchPartners(), fetchUsers()])
      setMessage('')
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

    async function fetchUsers() {
      let data
      try {
        data = (await (
          await fetch(`${process.env.API_BACKEND_URL}/dashboard/users`, {
            headers: {
              Authorization: 'Bearer ' + (await user?.getIdToken(true)),
            },
          })
        ).json()) as UserTypes
        console.log(data)
        if (!data) {
          setMessage("Couldn't find data :(")
          throw 'User data not on firebase for some reason'
        }
        setUsers(data)
      } catch (error) {
        console.error(error)
        setMessage('Failed to fetch users :(')
      }
    }

    async function fetchGame() {
      const query = firestore.query(
        firestore.collection(firestore.getFirestore(), 'games'),
        firestore.limit(1),
        firestore.where('id', '==', Number(params.id))
      )

      let data

      try {
        const querySnapshot = await firestore.getDocs(query)
        if (!querySnapshot || querySnapshot.docs.length === 0) {
          setMessage('Error fetching game :(')
          throw 'Game data not on firebase for some reason'
        }
        data = querySnapshot.docs[0].data() as Game
      } catch (error) {
        console.error(error)
        setMessage('Failed to fetch game data :(')
      }
      setGame(data)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <>
      {message ? (
        <p>{message}</p>
      ) : (
        <GameForm
          edit
          game={game}
          partners={partners}
          id={Number(params.id)}
          admin={
            users?.privileged.find((u) => u.uid === user?.uid) == undefined
          }
        />
      )}
    </>
  )
}
