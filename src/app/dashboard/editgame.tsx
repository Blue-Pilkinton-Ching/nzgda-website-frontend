import TextInput from './text-input'
import { Game } from '../../../types'
import Button from '../(components)/button'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

export default function EditGame({
  game,
  exit,
  className,
}: {
  className: string
  game?: Game
  exit: () => void
}) {
  const [user] = useAuthState(getAuth())

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ios, setIos] = useState('')
  const [android, setAndroid] = useState('')
  const [gamefroot, setGamefroot] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  useEffect(() => {
    resetGame(game)
  }, [game])

  async function resetGame(data: Game | undefined) {
    console.log(data)

    setName(data?.name || '')
    setDescription(data?.description || '')
    setIos(data?.iosLink || '')
    setAndroid(data?.androidLink || '')
    setGamefroot(data?.gamefrootLink || '')
    setWidth(data?.width?.toString() || '')
    setHeight(data?.height?.toString() || '')
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

  async function saveGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const res = await fetch(`/api/dashboard/${game?.id}`, {
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
        exit()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while saving the game')
        return
    }
  }

  return (
    <div className={`${className} `}>
      {name ? (
        <>
          <h1 className="text-4xl font-bold">{game?.name}</h1>
          <h2 className="text-1xl">{game?.id}</h2>
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
            <Button onClick={exit}>Back to games</Button>
          </div>
        </>
      ) : (
        <p className="text-lg font-semibold text-red">Loading Game...</p>
      )}
    </div>
  )
}
