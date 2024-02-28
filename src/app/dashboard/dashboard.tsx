'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  DashboardBody,
  DashboardBody as DashboardData,
  Game,
  GameListItem,
} from '../../../types'
import * as firestore from 'firebase/firestore'
import TextInput from './text-input'
import Button from '../(components)/button'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import { IoCheckmarkSharp, IoEye } from 'react-icons/io5'
import { IoEyeOff } from 'react-icons/io5'
import { MdModeEdit } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'

export default function Dashboard({
  data,
  invalidateData,
}: {
  data: DashboardData
  invalidateData: () => void
}) {
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

  const [dashboardData, setDashboardData] = useState<DashboardData>()

  const [panel, setPanel] = useState<'users' | 'games' | undefined>('games')

  useEffect(() => {
    setDashboardData(data)
  }, [data])

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
      },
    })

    switch (res.status) {
      case 200:
        exitGame()
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
    invalidateData()

    setGameID(undefined)
    setGame(undefined)
  }

  function onGameInputChange(
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

  async function onToggleVisibility(listItem: GameListItem) {
    const d = dashboardData as DashboardBody

    const shouldHide = !listItem.hidden

    setDashboardData({
      ...d,
      gameslist: {
        ...d.gameslist,
        data: d.gameslist.data.map((x) => {
          if (x.id === listItem.id) {
            x.hidden = shouldHide
          }
          return x
        }),
      },
    })

    const res = await fetch(`/api/dashboard/${listItem.id}/visibility`, {
      body: JSON.stringify({ hidden: shouldHide }),
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
    })

    switch (res.status) {
      case 200:
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while setting game visibility')
        return
    }
  }
  return (
    <>
      <div className="max-w-[600px] text-wrap mx-auto text-left mt-20 text-lg mb-12">
        <div className={game ? 'block' : 'hidden'}>
          <h1 className="text-4xl font-bold">
            {data.gameslist.data.find((x) => x.id === gameId)?.name}
          </h1>
          <h2 className="text-1xl">{gameId}</h2>
          <br />
          <form
            className={`flex-col mx-auto ${name ? 'flex' : 'hidden'}`}
            onSubmit={saveGame}
          >
            <TextInput
              onChange={onGameInputChange}
              value={name}
              required
              name={'Name'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={description}
              type="textarea"
              required
              name={'Description'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={ios}
              type="url"
              name={'Ios Link'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={android}
              type="url"
              name={'Android Link'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={gamefroot}
              type="url"
              name={'Gamefroot Link'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={width}
              type="number"
              tooltip="If this game has a maximum canvas width, enter it here. If not, leave it blank, or set to 0."
              name={'Width'}
            />
            <TextInput
              onChange={onGameInputChange}
              value={height}
              type="number"
              tooltip="Same as width, but for height."
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
        <div
          className={`border-collapse ${
            gameId == undefined ? 'block' : 'hidden'
          }`}
        >
          <div className="flex justify-center gap-10">
            <Button
              onClick={() => setPanel('games')}
              inverted={panel === 'users'}
            >
              Games
            </Button>
            <Button
              onClick={() => setPanel('users')}
              inverted={panel === 'games'}
            >
              Users & Settings
            </Button>
          </div>
          <br />
          <table className={panel === 'games' ? 'block' : 'hidden'}>
            <h1 className="text-center text-4xl font-bold">Games</h1>
            <br />
            <thead>
              <tr className="*:p-1">
                <th>ID</th>
                <th>Name</th>
                <th className="w-14 text-center">Edit</th>
                <th className="w-14 text-center">Hide</th>
                <th className="flex justify-center w-14 max-w-14 text-center">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.gameslist.data.map((element, index) => {
                return (
                  <tr
                    key={index}
                    className="*:p-1 odd:bg-white even:bg-pink-50"
                  >
                    <td>{element.id}</td>
                    <td>
                      <div
                        className="hover:underline cursor-pointer"
                        onClick={() => editGame(element.id)}
                      >
                        {element.name}
                      </div>
                    </td>
                    <td>
                      <IconButton onClick={() => editGame(element.id)}>
                        <MdModeEdit className="w-full" size={'30px'} />
                      </IconButton>
                    </td>
                    <td>
                      <IconButton
                        onClick={() => {
                          onToggleVisibility(element)
                        }}
                      >
                        {element.hidden ? (
                          <IoEyeOff className="w-full" size={'30px'} />
                        ) : (
                          <IoEye className="w-full" size={'30px'} />
                        )}
                      </IconButton>
                    </td>
                    <td>
                      <IconButton onClick={() => {}}>
                        <MdDeleteForever className="w-full" size={'30px'} />
                      </IconButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={panel === 'users' ? 'block' : 'hidden'}>
            <h1 className="text-center text-4xl font-bold">
              Authorisation Requests
            </h1>
            <br />
            <table className="w-full">
              <thead>
                <tr className="*:p-1">
                  <th>Email Address</th>
                  <th className="w-14 text-center">Accept</th>
                  <th className="w-14 text-center">Deny</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {dashboardData?.authRequests.map((element, index) => {
                  return (
                    <tr
                      key={index}
                      className="*:p-1 odd:bg-white even:bg-pink-50"
                    >
                      <td>
                        <div>{element.email}</div>
                      </td>
                      <td>
                        <IconButton onClick={() => {}}>
                          <IoCheckmarkSharp className="w-full" size={'30px'} />
                        </IconButton>
                      </td>
                      <td>
                        <IconButton onClick={() => {}}>
                          <FaXmark className="w-full" size={'30px'} />
                        </IconButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-10 block hover:scale-110 active:scale-95 duration-100"
    >
      {children}
    </button>
  )
}
