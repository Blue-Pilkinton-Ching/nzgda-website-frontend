'use client'

import Button from '../(components)/button'
import back from '../../../public/images/back.svg'
import Input from './input'
import Image from 'next/image'
import '../../utils/client/firebase'
import { ChangeEvent, useEffect, useState } from 'react'
import { Game, Partner } from '../../../types'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

export default function GameForm({
  edit,
  id,
  partners,
  game,
}: {
  edit: boolean
  id?: number
  partners: Partner[]
  game?: Game
}) {
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

  const [user] = useAuthState(getAuth())
  const router = useRouter()

  useEffect(() => {
    resetGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game])

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
      case 'Embed External Game URL':
        setGamefroot(event.target.value)
        break
      case 'Max Width':
        setWidth(event.target.value)
        break
      case 'Max Height':
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
      case 'Downloadable App':
        setDisplayAppBadge(event.target.value === 'false')
        break
    }
  }

  async function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let res
    if (edit && id) {
      res = await fetch(`/api/dashboard/${id}`, {
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
    } else if (typeof thumbnail === 'object') {
      const form = new FormData()

      form.append(
        'data',
        JSON.stringify({
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
        })
      )

      form.append('thumbnail', thumbnail)

      res = await fetch(`/api/dashboard/add`, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: 'Bearer ' + (await user?.getIdToken(true)),
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      return
    }

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
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function resetGame() {
    setName(game?.name || '')
    setDescription(game?.description || '')
    setIos(game?.iosLink || '')
    setAndroid(game?.androidLink || '')
    setGamefroot(game?.gamefrootLink || '')
    setWidth(game?.width?.toString() || '')
    setHeight(game?.height?.toString() || '')
    setTags(game?.tags?.toString() || '')
    setPlayableOnHeihei(game?.playableOnHeihei || true)
    setExcludeBrowserMobile(game?.exclude?.includes('mobileweb') || false)
    setExcludeBrowserDesktop(game?.exclude?.includes('desktop') || false)
    setPartner(game?.partner || 'None')
    setDisplayAppBadge(game?.displayAppBadge || false)
  }

  return (
    <>
      <div className="max-w-[600px] mx-auto text-left text-black">
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className={`duration-100 text-maingreen ${
              edit ? '*:mb-4' : ''
            } hover:scale-110 active:scale-95 hover:rotate-6 active:-rotate-12`}
          >
            <Image src={back} alt={back} className="w-14 brightness-0"></Image>
          </button>
          <div className="flex flex-col justify-center-center">
            <h1 className="text-4xl font-bold my-auto">
              {edit ? (!game ? 'Loading' : name) : name ? name : 'New Game'}
            </h1>
            <h2 className="text-1xl">{id}</h2>
          </div>
        </div>
        <br />
        {edit && !game ? (
          <p>Loading Game...</p>
        ) : (
          <form className={`flex-col mx-auto flex`} onSubmit={formSubmit}>
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

              {game &&
              game.partner &&
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
            <Input
              onChange={onGameInputChange}
              value={displayAppBadge}
              tooltip={`Display this game in the 'Downloadable apps' catagory`}
              type="checkbox"
              maxLength={0}
              name={'Downloadable App'}
            />
            <Input
              onChange={onGameInputChange}
              value={playableOnHeihei}
              type="checkbox"
              tooltip={`Display this game inside the 'Play Online Games' catagory`}
              maxLength={0}
              name={'Playable on Heihei'}
            />
            <Input
              onChange={onGameInputChange}
              value={excludeBrowserMobile}
              type="checkbox"
              maxLength={0}
              name={'Exclude on mobile browser'}
              tooltip="Don't display this game on mobile devices."
            />
            <Input
              onChange={onGameInputChange}
              value={excludeBrowserDesktop}
              type="checkbox"
              maxLength={0}
              name={'Exclude on desktop browser'}
              tooltip="Don't display this game on desktop devices."
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
              tooltip="Ideally your game's canvas should extend infinitely. If this is the case, leave this value blank or set to 0. Otherwise enter the canvas's max width in px."
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
              {edit ? 'Change Thumbnail' : 'Upload Thumbnail'}
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
                {edit ? 'Save Game' : 'Add Game'}
              </Button>
              {edit ? (
                <Button
                  onClick={(event) => {
                    event.preventDefault()
                    resetGame()
                  }}
                  className="bg-black text-white"
                  invertedClassName="bg-white text-black"
                >
                  Reset
                </Button>
              ) : null}
            </div>
          </form>
        )}
      </div>
      <br />
    </>
  )
}
