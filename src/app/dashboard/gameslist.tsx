import { MdDeleteForever, MdModeEdit } from 'react-icons/md'
import { IconButton } from '../(components)/iconButton'
import { GameListItem } from '../../../types'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import Confirm from './confirm'
import { useRouter } from 'next/navigation'
import Button from '../(components)/button'
import Link from 'next/link'
import { FaCrown } from 'react-icons/fa'
import { TbCrownOff } from 'react-icons/tb'

export default function GamesList({
  games,
  className,
  invalidateGames,
}: {
  games: GameListItem[]
  className: string
  invalidateGames: () => void
}) {
  const [user] = useAuthState(getAuth())

  const [currentGames, setCurrentGames] = useState<GameListItem[]>([])
  const [confirmText, setConfirmText] = useState('')
  const [gameToDelete, setGameToDelete] = useState(0)

  const router = useRouter()

  useEffect(() => {
    setCurrentGames(games)
  }, [games])

  async function onToggleVisibility(listItem: GameListItem) {
    const shouldHide = !listItem.hidden

    let res

    setCurrentGames(
      currentGames.map((x) => {
        if (x.id === listItem.id) {
          x.hidden = shouldHide
        }
        return x
      })
    )

    try {
      res = await fetch(`/api/dashboard/${listItem.id}/visibility`, {
        body: JSON.stringify({ hidden: shouldHide }),
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while setting game visibility')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while setting game visibility')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function deleteGame() {
    let res
    try {
      res = await fetch(`/api/dashboard/${gameToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert(`'An error occured while deleting game ${gameToDelete}'`)
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        invalidateGames()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while deleting partner')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  async function onToggleFeature(listItem: GameListItem) {
    const shouldFeature = !(listItem.featured || false)

    let res

    setCurrentGames(
      currentGames.map((x) => {
        if (x.id === listItem.id) {
          x.featured = shouldFeature
        } else {
          x.featured = false
        }
        return x
      })
    )

    try {
      res = await fetch(`/api/dashboard/${listItem.id}/feature`, {
        body: JSON.stringify({ featured: shouldFeature }),
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while setting game feature')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while setting game feature')
        return
      default:
        alert('An unknown error occured')
        console.error(res.status, res.statusText, res.body)
        return
    }
  }

  return (
    <div className={`shadow-lg p-4 rounded ${className}`}>
      <Confirm
        text={confirmText}
        onConfirm={() => deleteGame()}
        onCancel={() => setConfirmText('')}
      />
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Games</h1>
        <Link href={'/dashboard/add'}>
          <Button
            className="bg-black text-white float-right"
            invertedClassName="bg-white text-black"
          >
            Add New Game
          </Button>
        </Link>
      </div>
      <br />
      <table className="w-full">
        <thead>
          <tr className="*:p-1">
            <th>ID</th>
            <th>Name</th>
            <th className="w-14 text-center">Feature</th>
            <th className="w-14 text-center">Edit</th>
            <th className="w-14 text-center">Hide</th>
            <th className="flex justify-center w-14 max-w-14 text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((element, index) => {
            return (
              <tr key={index} className="*:p-1 odd:bg-white even:bg-zinc-100">
                <td>{element.id}</td>
                <td>
                  <div
                    className="hover:underline cursor-pointer"
                    onClick={() => router.push(`/dashboard/edit/${element.id}`)}
                  >
                    {element.name}
                  </div>
                </td>
                <td>
                  <IconButton
                    onClick={() => {
                      onToggleFeature(element)
                    }}
                  >
                    {element.featured ? (
                      <FaCrown className="w-full" size={'28px'} />
                    ) : (
                      <TbCrownOff className="w-full" size={'30px'} />
                    )}
                  </IconButton>
                </td>
                <td>
                  <IconButton
                    onClick={() => router.push(`/dashboard/edit/${element.id}`)}
                  >
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
                {element.id > 200 ? (
                  <td>
                    <IconButton
                      onClick={() => {
                        setGameToDelete(element.id)
                        setConfirmText(
                          'Are you sure you want to delete this partner? This action is irreversible.'
                        )
                      }}
                    >
                      <MdDeleteForever className="w-full" size={'30px'} />
                    </IconButton>
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
