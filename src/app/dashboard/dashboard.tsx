'use client'
import { useState } from 'react'
import { DashboardBody as DashboardData, Game } from '../../../types'
import * as firestore from 'firebase/firestore'
import TextInput from './text-input'
import { useRef } from 'react'
import Button from '../(components)/button'
import { set } from 'firebase/database'

export default function Dashboard({ data }: { data: DashboardData }) {
  const [gameId, setGameID] = useState<number>()

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

    setName(data.name)
    setDescription(data.description)
    setIos(data.iosLink || '')
    setAndroid(data.androidLink || '')
    setGamefroot(data.gamefrootLink || '')
    setWidth(data.width?.toString() || '')
    setHeight(data.height?.toString() || '')
  }

  async function saveGame() {}
  async function exitGame() {
    setGameID(undefined)
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
          <form className="flex flex-col mx-auto">
            <TextInput value={name} required name={'Name'} />
            <TextInput
              value={description}
              type="textarea"
              required
              name={'Description'}
            />
            <TextInput value={ios} type="url" name={'Ios Link'} />
            <TextInput value={android} type="url" name={'Android Link'} />
            <TextInput value={gamefroot} type="url" name={'Gamefroot Link'} />
            <TextInput value={width} type="number" name={'Width'} />
            <TextInput value={height} type="number" name={'Height'} />
            <div className="mx-auto *:block *:w-38">
              <Button onClick={saveGame} inverted>
                Save Game
              </Button>
            </div>
          </form>
          <div className="mx-auto w-40">
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
