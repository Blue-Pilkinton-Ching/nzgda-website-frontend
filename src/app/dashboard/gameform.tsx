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
import JSZip from 'jszip'

export default function GameForm({
  edit,
  id,
  partners,
  game,
  admin,
}: {
  admin: boolean
  edit: boolean
  id?: number
  partners: Partner[]
  game?: Game
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ios, setIos] = useState('')
  const [android, setAndroid] = useState('')
  //   const [gamefroot, setGamefroot] = useState('')
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
  const [thumbnail, setThumbnail] = useState<File>()
  const [thumbnailWarning, setThumbnailWarning] = useState('')
  const [gameFolder, setGameFolder] = useState<File>()
  const [gameWarning, setGameWarning] = useState('')
  const [banner, setBanner] = useState<File>()
  const [bannerWarning, setBannerWarning] = useState('')
  const [isEducational, setIsEducational] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [user] = useAuthState(getAuth())
  const router = useRouter()

  useEffect(() => {
    resetGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game])

  async function onGameInputChange(
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
      //   case 'Embed External Game URL':
      //     setGamefroot(event.target.value)
      //     break
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
      case 'Partner / Studio':
        setPartner(event.target.value)
        break
      case 'Downloadable App':
        setDisplayAppBadge(event.target.value === 'false')
        break
      case 'Change Thumbnail':
        const target = event.target as HTMLInputElement

        if (target.files && target.files[0]) {
          if (target.files.length > 1) {
            setThumbnailWarning('Only one file is allowed!')
            setThumbnail(undefined)
            break
          }
          if (target.files[0].size > 1048576 * 4) {
            setThumbnailWarning('File size should be less than 4mb!')
            setThumbnail(undefined)
            break
          }
          if (target.files[0].type !== 'image/png') {
            setThumbnailWarning('File should be an image!')
            setThumbnail(undefined)
            break
          }
          setThumbnailWarning('')
          setThumbnail(target.files[0])
        }
        break
      case 'Change Banner':
        const target3 = event.target as HTMLInputElement

        if (target3.files && target3.files[0]) {
          if (target3.files.length > 1) {
            setBannerWarning('Only one file is allowed!')
            setBanner(undefined)
            break
          }
          if (target3.files[0].size > 1048576 * 8) {
            setBannerWarning('File size should be less than 8mb!')
            setBanner(undefined)
            break
          }
          if (target3.files[0].type !== 'image/png') {
            setBannerWarning('File should be an image!')
            setBanner(undefined)
            break
          }
          setBannerWarning('')
          setBanner(target3.files[0])
        }
        break
      case 'Change Game Folder':
        const target2 = event.target as HTMLInputElement

        if (target2.files && target2.files[0]) {
          if (target2.files.length > 1) {
            setGameWarning('Only one file is allowed!')
            setGameFolder(undefined)
            break
          }
          if (target2.files[0].size > 2147483648) {
            setGameWarning('File size should be less than 2gb!')
            setGameFolder(undefined)
            break
          }
          if (target2.files[0].type !== 'application/x-zip-compressed') {
            setGameWarning('Upload should be a compressed .zip !')
            setGameFolder(undefined)
            break
          }

          const zip = await new JSZip().loadAsync(target2.files[0])

          if (!zip.files[`index.html`]) {
            setGameWarning(
              'Zip should contain an index.html file at its route!'
            )
            setGameFolder(undefined)
            break
          }

          setGameWarning('')
          setGameFolder(target2.files[0])
        }
        break
      case 'Educational':
        setIsEducational(event.target.value === 'false')
        break
    }
  }

  async function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (thumbnailWarning || gameWarning || bannerWarning) {
      alert('Please fix the errors before submitting')
      return
    }

    setSubmitting(true)

    let res
    if (edit && id) {
      const form = new FormData()

      form.append(
        'data',
        JSON.stringify({
          name,
          description,
          iosLink: ios,
          androidLink: android,
          //   gamefrootLink: gamefroot,
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
          educational: isEducational,
        })
      )

      if (thumbnail) {
        form.append('thumbnail', thumbnail)
      }

      if (gameFolder) {
        form.append('game', gameFolder)
      }

      if (banner) {
        form.append('banner', banner)
      }

      res = await fetch(`${process.env.API_BACKEND_URL}/dashboard/${id}`, {
        method: 'PATCH',
        body: form,
        headers: {
          Authorization: 'Bearer ' + (await user?.getIdToken(true)),
        },
      })
    } else if (thumbnail != undefined) {
      if (/*!gamefroot &&*/ !gameFolder && !banner) {
        alert(
          //   'You must upload a game, a banner, or provide an external game link'
          'You must upload a game or a banner'
        )
        return
      }

      const form = new FormData()

      form.append(
        'data',
        JSON.stringify({
          name,
          description,
          iosLink: ios,
          androidLink: android,
          //   gamefrootLink: gamefroot,
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
          educational: isEducational,
        })
      )

      form.append('thumbnail', thumbnail)

      if (gameFolder) {
        form.append('game', gameFolder)
      }

      if (banner) {
        form.append('banner', banner)
      }

      res = await fetch(`${process.env.API_BACKEND_URL}/dashboard/add`, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: 'Bearer ' + (await user?.getIdToken(true)),
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
        setSubmitting(false)
        return
      case 500:
        alert('An error occured while saving the game')
        setSubmitting(false)
        return
      default:
        alert('An unknown error occured')
        setSubmitting(false)
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function resetGame() {
    setName(game?.name || '')
    setDescription(game?.description || '')
    setIos(game?.iosLink || '')
    setAndroid(game?.androidLink || '')
    // setGamefroot(game?.gamefrootLink || '')
    setWidth(game?.width?.toString() || '')
    setHeight(game?.height?.toString() || '')
    setTags(game?.tags?.toString() || '')
    setPlayableOnHeihei(game?.playableOnHeihei || true)
    setExcludeBrowserMobile(game?.exclude?.includes('mobileweb') || false)
    setExcludeBrowserDesktop(game?.exclude?.includes('desktop') || false)
    setPartner(game?.partner || 'None')
    setDisplayAppBadge(game?.displayAppBadge || false)
    setIsEducational(game?.educational || false)
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
        <div className={submitting ? 'block' : 'hidden'}>
          <p>Submitting Game, please wait...</p>
        </div>
        <div className={submitting ? 'hidden' : 'block'}>
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
              {admin ? (
                <>
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
                    onChange={(event) =>
                      onGameInputChange(event, 'Partner / Studio')
                    }
                    className="cursor-pointer mb-3 py-0.5 px-2 rounded-lg flex-1 border-zinc-500 border shadow-md focus:border-black outline-none text-lg"
                  >
                    <option value={'None'}>None</option>

                    {game &&
                    game.partner &&
                    partners.find((x) => x.name === game.partner) ===
                      undefined ? (
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
                </>
              ) : null}
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
                value={isEducational}
                type="checkbox"
                maxLength={0}
                name={'Educational'}
                tooltip="Display this game as having educational value"
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
              {/* <Input
                onChange={onGameInputChange}
                value={gamefroot}
                type="url"
                maxLength={1000}
                name={'Embed External Game URL'}
                tooltip="If your game is hosted on another site, you can add the embed url here"
              /> */}
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
              {(edit && id != undefined && id > 200) || !edit ? (
                <>
                  <label
                    htmlFor="Change Thumbnail"
                    className="text-left text-base font-bold mb-1"
                  >
                    {edit ? 'Change Thumbnail' : 'Upload Thumbnail'}
                  </label>
                  <p className="text-zinc-500 text-sm mb-3">
                    Thumbnail should be 300x400px. Maximum size is 4mb.
                  </p>
                  <input
                    multiple={false}
                    type="file"
                    required={edit ? false : true}
                    name="Change Thumbnail"
                    accept="image/png"
                    id="Change Thumbnail"
                    onChange={(event) =>
                      onGameInputChange(event, 'Change Thumbnail')
                    }
                  />
                  <div className="py-3 text-rose-600">
                    {thumbnailWarning ? (
                      <p className="text-lg font-semibold">
                        {thumbnailWarning}
                      </p>
                    ) : thumbnail ? (
                      <div className="rounded-md shadow w-[150px] h-[200px]">
                        <Image
                          src={URL.createObjectURL(thumbnail)}
                          alt={'Uploaded Thumnail'}
                          className="rounded-md shadow"
                          width={256}
                          height={341}
                        ></Image>
                      </div>
                    ) : null}
                  </div>
                  <br />
                  <label
                    htmlFor="Change Game Folder"
                    className="text-left text-base font-bold mb-1"
                  >
                    {edit ? 'Change Game' : 'Upload Game'}
                  </label>
                  <p className="text-zinc-500 text-sm mb-3">
                    Game should be uploaded as a compressed .zip file. Maximum
                    size is 2gb. <br />
                    <br />
                    You should have a index.html file at the root of the zip.
                    Your files should not be contained inside an additional
                    folder.
                  </p>
                  <input
                    multiple={false}
                    type="file"
                    name="Change Game Folder"
                    accept="application/x-zip-compressed"
                    id="Change Game Folder"
                    onChange={(event) =>
                      onGameInputChange(event, 'Change Game Folder')
                    }
                  />
                  <div className="py-3 text-rose-600">
                    {gameWarning ? (
                      <p className="text-lg font-semibold">{gameWarning}</p>
                    ) : null}
                  </div>
                  <label
                    htmlFor="Change Banner"
                    className="text-left text-base font-bold mb-1"
                  >
                    {edit ? 'Change Banner' : 'Upload Banner'}
                  </label>
                  <p className="text-zinc-500 text-sm mb-3">
                    Banner should be a large 16/9 aspect. Reccomended size is
                    1424px x 801px.
                  </p>

                  <input
                    multiple={false}
                    type="file"
                    name="Change Banner"
                    accept="image/png"
                    id="Change Thumbnail"
                    onChange={(event) =>
                      onGameInputChange(event, 'Change Banner')
                    }
                  />
                  <div className="py-3 text-rose-600">
                    {bannerWarning ? (
                      <p className="text-lg font-semibold">{bannerWarning}</p>
                    ) : banner ? (
                      <div className="rounded-md shadow w-[240px] h-[135px]">
                        <Image
                          src={URL.createObjectURL(banner)}
                          alt={'Uploaded Banner'}
                          className="rounded-md shadow"
                          width={360}
                          height={180}
                        ></Image>
                      </div>
                    ) : null}
                  </div>
                  <br />
                </>
              ) : null}
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
      </div>
    </>
  )
}
