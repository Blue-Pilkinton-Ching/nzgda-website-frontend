'use client'

import { GamesList, Partner, User, UserTypes } from '../../../../types'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import * as firestore from 'firebase/firestore'

import GameForm from '../gameform'

export default function Page() {
  const [user] = useAuthState(getAuth())

  const [partners, setPartners] = useState<Partner[]>([])
  const [users, setUsers] = useState<UserTypes>()

  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user == null) {
      window.location.href = '/dashboard'
      return
    } else {
      fetchPartners()
      fetchUsers()
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
  }, [user])

  return (
    <>
      {message ? (
        <p>{message}</p>
      ) : (
        <GameForm
          edit={false}
          partners={partners}
          admin={
            users?.privileged.find((u) => u.uid === user?.uid) == undefined
          }
        />
      )}
    </>
  )
}
