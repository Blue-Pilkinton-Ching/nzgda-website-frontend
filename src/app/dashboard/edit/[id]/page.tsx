'use client'

import Input from './../../input'
import { Game, GamesList, Partner } from '../../../../../types'
import Button from '../../../(components)/button'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import back from '../../../../../public/images/back.svg'
import '../../../../utils/client/firebase'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import * as firestore from 'firebase/firestore'

export default function EditGame() {
  const [user] = useAuthState(getAuth())

  const [message, setMessage] = useState('Loading Game...')

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
  const [partner, setPartner] = useState('')
  const [displayAppBadge, setDisplayAppBadge] = useState(false)

  const [thumbnail, setThumbnail] = useState<File | string>('')

  const [game, setGame] = useState<Game>()

  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [partners, setPartners] = useState<Partner[]>()

  useEffect(() => {
    if (user == null) {
      window.location.href = '/dashboard'
      return
    } else {
      console.log(user)
      Promise.all([fetchGame(), fetchPartners()])
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

    async function fetchGame() {
      console.log(params.id)

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
      resetGame(data)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function resetGame(data: Game | undefined) {
    setGame(data)

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
    setPartner(data?.partner || 'None')
    setDisplayAppBadge(data?.displayAppBadge || false)
  }

  function onGameInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      case 'Partner / Studio':
        setPartner(event.target.value)
        break
      case 'Display App Badge':
        setDisplayAppBadge(event.target.value === 'false')
        break
    }
  }

  async function saveGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const res = await fetch(`/api/dashboard/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        description,
        iosLink: ios,
        androidLink: android,
        gamefrootLink: gamefroot,
        width: Number(width) ? Number(width) : null,
        height: Number(height) ? Number(height) : null,
        tags: tags.split(','),
        playableOnHeihei,
        exclude: [
          excludeBrowserMobile ? 'mobileweb' : '',
          excludeBrowserDesktop ? 'desktop' : '',
        ].toString(),
        partner: partner === 'None' ? '' : partner,
        displayAppBadge,
      }),
      headers: {
        Authorization: 'Bearer ' + (await user?.getIdToken(true)),
      },
    })

    switch (res.status) {
      case 200:
        router.push('/dashboard')
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
    <div className="max-w-[600px] mx-auto text-left text-black">
      {game && partners ? (
        <>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="duration-100 text-green *:mb-4 hover:scale-110 active:scale-95 hover:rotate-6 active:-rotate-12 "
            >
              <Image
                src={back}
                alt={back}
                className="w-14 brightness-0"
              ></Image>
            </button>
            <div>
              <h1 className="text-4xl font-bold">{name}</h1>
              <h2 className="text-1xl">{params.id}</h2>
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
            <label
              htmlFor="Partner / Studio"
              className="text-left text-base font-bold mb-1"
            >
              Partner / Studio
            </label>
            <p className="text-zinc-500 text-sm mb-3">
              Name of this games partner / studio
            </p>
            <select
              id="Partner / Studio"
              name="Partner / Studio"
              value={partner}
              onChange={(event) => onGameInputChange(event, 'Partner / Studio')}
              className="cursor-pointer mb-3 py-0.5 px-2 rounded-lg flex-1 border-zinc-500 border shadow-md focus:border-black outline-none text-lg"
            >
              <option value={'None'}>None</option>

              {game?.partner &&
              partners.find((x) => x.name === game.partner) === undefined ? (
                <option value={game.partner}>{game.partner}</option>
              ) : (
                ''
              )}
              <optgroup label="Shown">
                {partners.map((element) => {
                  return element.hidden === false ? (
                    <option key={element.name} value={element.name}>
                      {element.name}
                    </option>
                  ) : null
                })}
              </optgroup>
              <optgroup label="Hidden">
                {partners.map((element) => {
                  return element.hidden === true ? (
                    <option key={element.name} value={element.name}>
                      {element.name}
                    </option>
                  ) : null
                })}
              </optgroup>
            </select>
            <Input
              onChange={onGameInputChange}
              value={tags}
              type="text"
              maxLength={200}
              name={'Tags'}
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
            <br />
            <Input
              onChange={onGameInputChange}
              value={displayAppBadge}
              type="checkbox"
              maxLength={0}
              name={'Display App Badge'}
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
              name={'Max Width'}
            />
            <Input
              onChange={onGameInputChange}
              value={height}
              type="number"
              maxLength={4}
              tooltip="Same as width, but for height."
              name={'Max Height'}
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
              id="Change Thumbnail"
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
            <div className="flex justify-center *:w-32 gap-4">
              <Button
                inverted
                className="bg-black text-white"
                invertedClassName="bg-white text-black"
              >
                Save Game
              </Button>
              <Button
                onClick={(event) => {
                  event.preventDefault()
                  resetGame(game)
                }}
                className="bg-black text-white"
                invertedClassName="bg-white text-black"
              >
                Reset
              </Button>
            </div>
          </form>
        </>
      ) : (
        <p className="text-lg font-semibold text-red">{message}</p>
      )}
    </div>
  )
}
