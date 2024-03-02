import Input from './input'
import { Game } from '../../../types'
import Button from '../(components)/button'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import back from '../../../public/images/back.svg'

import Image from 'next/image'

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
  const [tags, setTags] = useState('')
  const [playableOnHeihei, setPlayableOnHeihei] = useState<boolean>(false)
  const [excludeBrowserMobile, setExcludeBrowserMobile] =
    useState<boolean>(false)
  const [excludeBrowserDesktop, setExcludeBrowserDesktop] =
    useState<boolean>(false)

  const [thumbnail, setThumbnail] = useState<File | string>('')

  useEffect(() => {
    resetGame(game)
  }, [game])

  async function resetGame(data: Game | undefined) {
    setName(data?.name || '')
    setDescription(data?.description || '')
    setIos(data?.iosLink || '')
    setAndroid(data?.androidLink || '')
    setGamefroot(data?.gamefrootLink || '')
    setWidth(data?.width?.toString() || '')
    setHeight(data?.height?.toString() || '')
    setTags(data?.tags?.toString() || '')
    setPlayableOnHeihei(data?.playableOnHeihei || true)
    setExcludeBrowserMobile(data?.exclude?.includes('mobileweb') || false)
    setExcludeBrowserDesktop(data?.exclude?.includes('desktop') || false)
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
      case 'Tags':
        setTags(event.target.value)
        break
      case 'Playable on Heihei':
        setPlayableOnHeihei(event.target.value === 'false')
        break
      case 'Exclude on mobile browser':
        setExcludeBrowserMobile(event.target.value === 'false')
        break
      case 'Exclude on desktop browser':
        setExcludeBrowserDesktop(event.target.value === 'false')
        break
      case 'Change Thumbnail':
        const target = event.target as HTMLInputElement

        console.log(target.files)

        if (target.files && target.files[0]) {
          if (target.files.length > 1) {
            setThumbnail('Only one file is allowed!')
            break
          }
          if (target.files[0].size > 1048576) {
            setThumbnail('File size should be less than 1MB!')
            break
          }
          if (
            target.files[0].type !== 'image/png' &&
            target.files[0].type !== 'image/jpeg' &&
            target.files[0].type !== 'image/gif'
          ) {
            setThumbnail('File should be an image!')
            break
          }
          setThumbnail(target.files[0])
        }
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
          <div className="flex gap-4">
            <button
              onClick={exit}
              className="duration-100 text-green *:mb-4 hover:scale-110 active:scale-95 hover:rotate-6 active:-rotate-12 "
            >
              <Image
                src={back}
                alt={back}
                className="w-14 brightness-0"
              ></Image>
            </button>
            <div>
              <h1 className="text-4xl font-bold">{game?.name}</h1>
              <h2 className="text-1xl">{game?.id}</h2>
            </div>
          </div>
          <br />

          <form
            className={`flex-col mx-auto ${name ? 'flex' : 'hidden'}`}
            onSubmit={saveGame}
          >
            <Input
              onChange={onGameInputChange}
              value={name}
              required
              maxLength={100}
              name={'Name'}
              tooltip="This is the name that will be displayed on the HEIHEI website"
            />
            <Input
              onChange={onGameInputChange}
              value={description}
              type="textarea"
              required
              maxLength={1000}
              name={'Description'}
              tooltip="This is the description people will see when they open your game. There is a 1000 character limit"
            />
            <Input
              onChange={onGameInputChange}
              value={ios}
              type="url"
              maxLength={1000}
              name={'Ios Link'}
              tooltip="If your game has an AppStore link you can add that here"
            />
            <Input
              onChange={onGameInputChange}
              value={android}
              type="url"
              maxLength={1000}
              name={'Android Link'}
              tooltip="If your game has an Google Play Store link you can add that here"
            />
            <Input
              onChange={onGameInputChange}
              value={gamefroot}
              type="url"
              maxLength={1000}
              name={'Embed External Game URL'}
              tooltip="If your game is hosted on another site, you can add the embed url here"
            />
            <Input
              onChange={onGameInputChange}
              value={width}
              type="number"
              maxLength={4}
              tooltip="Ideally your game's canvas should extend infinitely. If this is the case, leave this value blank, or set to 0. If this is not the base, enter the canvas's max width in px."
              name={'Width'}
            />
            <Input
              onChange={onGameInputChange}
              value={height}
              type="number"
              maxLength={4}
              tooltip="Same as width, but for height."
              name={'Height'}
            />
            <Input
              onChange={onGameInputChange}
              value={tags}
              type="text"
              maxLength={200}
              name={'Tags'}
            />
            <Input
              onChange={onGameInputChange}
              value={playableOnHeihei}
              type="checkbox"
              maxLength={0}
              name={'Playable on Heihei'}
            />
            <Input
              onChange={onGameInputChange}
              value={excludeBrowserMobile}
              type="checkbox"
              maxLength={0}
              name={'Exclude on mobile browser'}
            />
            <Input
              onChange={onGameInputChange}
              value={excludeBrowserDesktop}
              type="checkbox"
              maxLength={0}
              name={'Exclude on desktop browser'}
            />
            <br />
            <label
              htmlFor="Change Thumbnail"
              className="text-left text-base font-bold mb-1"
            >
              Change Thumbnail
            </label>
            <p className="text-zinc-500 text-sm mb-3">
              Thumbnail should be 300x400px
            </p>

            <input
              multiple={false}
              type="file"
              name="Change Thumbnail"
              accept="image/*"
              onChange={(event) => onGameInputChange(event, 'Change Thumbnail')}
            />
            {thumbnail ? (
              <div className="py-3 text-rose-600">
                {typeof thumbnail === 'string' ? (
                  <p className="text-lg font-semibold">{thumbnail}</p>
                ) : (
                  <div className="rounded-md shadow w-[150px] h-[200px]">
                    <Image
                      src={URL.createObjectURL(thumbnail)}
                      alt={'Uploaded Thumnail'}
                      className="rounded-md shadow"
                      width={256}
                      height={341}
                    ></Image>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
            <br />

            <div className="mx-auto *:block *:w-38">
              <Button
                inverted
                className="bg-black text-white"
                invertedClassName="bg-white text-black"
              >
                Save Game
              </Button>
            </div>
          </form>
          <div className="mx-auto w-40 *:w-40">
            <Button
              onClick={() => resetGame(game as Game)}
              className="bg-black text-white"
              invertedClassName="bg-white text-black"
            >
              Reset
            </Button>
          </div>
        </>
      ) : (
        <p className="text-lg font-semibold text-red">Loading Game...</p>
      )}
    </div>
  )
}