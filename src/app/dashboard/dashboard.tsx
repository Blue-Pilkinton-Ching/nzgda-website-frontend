'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import { DashboardBody as DashboardData, Game } from '../../../types'
import * as firestore from 'firebase/firestore'
import TextInput from './text-input'
import Button from '../(components)/button'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

export default function Dashboard({ data }: { data: DashboardData }) {
  const [gameId, setGameID] = useState<number>()

  const [user] = useAuthState(getAuth())

  const [game, setGame] = useState<Game>()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ios, setIos] = useState('')
  const [android, setAndroid] = useState('')
  const [gamefroot, setGamefroot] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  async function editGame(id: number) {
    setGameID(id)

    const query = firestore.query(
      firestore.collection(firestore.getFirestore(), 'games'),
      firestore.limit(1),
      firestore.where('id', '==', id)
    )

    const querySnapshot = await firestore.getDocs(query)

    if (querySnapshot.empty) {
      alert("Couldn't find game")
      return
    }

    const data = querySnapshot.docs[0].data() as Game

    setGame(data)
    resetGame(data)
  }

  async function saveGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!game) {
      alert('No game selected')
      return
    }

    const res = await fetch(`/api/dashboard/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        description,
        iosLink: ios,
        androidLink: android,
        gamefrootLink: gamefroot,
        width: Number(width) ? Number(width) : null,
        height: Number(height) ? Number(height) : null,
      }),
      headers: {
        Authorization: 'Bearer ' + (await user?.getIdToken(true)),
        'Content-Type': 'application/json',
      },
    })

    switch (res.status) {
      case 200:
        alert('Game saved')
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while saving the game')
        return
    }
  }

  async function resetGame(data: Game) {
    setName(data.name)
    setDescription(data.description)
    setIos(data.iosLink || '')
    setAndroid(data.androidLink || '')
    setGamefroot(data.gamefrootLink || '')
    setWidth(data.width?.toString() || '')
    setHeight(data.height?.toString() || '')
  }

  async function exitGame() {
    setGameID(undefined)
  }

  function onInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) {
    switch (name) {
      case 'Name':
        setName(event.target.value)
        break
      case 'Description':
        setDescription(event.target.value)
        break
      case 'Ios Link':
        setIos(event.target.value)
        break
      case 'Android Link':
        setAndroid(event.target.value)
        break
      case 'Gamefroot Link':
        setGamefroot(event.target.value)
        break
      case 'Width':
        setWidth(event.target.value)
        break
      case 'Height':
        setHeight(event.target.value)
        break
    }
  }

  return (
    <>
      <div className="max-w-[600px] text-wrap mx-auto text-left mt-20 text-lg mb-12">
        <div className={gameId ? 'block' : 'hidden'}>
          <h1 className="text-4xl font-bold">
            {data.gameslist.data.find((x) => x.id === gameId)?.name}
          </h1>
          <h2 className="text-1xl">{gameId}</h2>
          <br />
          <form className="flex flex-col mx-auto " onSubmit={saveGame}>
            <TextInput
              onChange={onInputChange}
              value={name}
              required
              name={'Name'}
            />
            <TextInput
              onChange={onInputChange}
              value={description}
              type="textarea"
              required
              name={'Description'}
            />
            <TextInput
              onChange={onInputChange}
              value={ios}
              type="url"
              name={'Ios Link'}
            />
            <TextInput
              onChange={onInputChange}
              value={android}
              type="url"
              name={'Android Link'}
            />
            <TextInput
              onChange={onInputChange}
              value={gamefroot}
              type="url"
              name={'Gamefroot Link'}
            />
            <TextInput
              onChange={onInputChange}
              value={width}
              type="number"
              name={'Width'}
            />
            <TextInput
              onChange={onInputChange}
              value={height}
              type="number"
              name={'Height'}
            />
            <div className="mx-auto *:block *:w-38">
              <Button inverted>Save Game</Button>
            </div>
          </form>
          <div className="mx-auto w-40 *:w-40">
            <Button onClick={() => resetGame(game as Game)} inverted>
              Reset
            </Button>
            <Button onClick={exitGame}>Back to games</Button>
          </div>
        </div>
        <table className={`border-collapse ${gameId ? 'hidden' : 'block'}`}>
          <thead>
            <tr className="*:p-1">
              <th>ID</th>
              <th>Name</th>
              <th>Hide</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.gameslist.data.map((element, index) => {
              return (
                <tr key={index} className="*:p-1 odd:bg-white even:bg-pink-50">
                  <td>{element.id}</td>
                  <td>
                    <div
                      className="hover:underline cursor-pointer"
                      onClick={() => editGame(element.id)}
                    >
                      {element.name}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
