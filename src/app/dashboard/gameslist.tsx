import { MdDeleteForever, MdModeEdit } from 'react-icons/md'
import { IconButton } from '../(components)/iconButton'
import { Game, GameListItem } from '../../../types'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import * as firestore from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export default function GamesList({
  className,
  games,
  setGame,
}: {
  className: string
  games: GameListItem[]
  setGame: (game: Game) => void
}) {
  const [user] = useAuthState(getAuth())

  const [currentGames, setCurrentGames] = useState<GameListItem[]>([])

  useEffect(() => {
    setCurrentGames(games)
  }, [games])

  async function editGame(gameListItem: GameListItem) {
    setGame({ id: gameListItem.id, name: gameListItem.name } as Game)

    const query = firestore.query(
      firestore.collection(firestore.getFirestore(), 'games'),
      firestore.limit(1),
      firestore.where('id', '==', gameListItem.id)
    )

    const querySnapshot = await firestore.getDocs(query)

    if (!querySnapshot || querySnapshot.docs.length === 0) {
      alert("Couldn't find game")
      return
    }

    const data = querySnapshot.docs[0].data() as Game

    console.log(data)

    setGame(data)
  }

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
    }
  }

  return (
    <div className={className}>
      <h1 className="text-4xl font-bold">Games</h1>
      <br />
      <table>
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
          {games.map((element, index) => {
            return (
              <tr key={index} className="*:p-1 odd:bg-white even:bg-zinc-100">
                <td>{element.id}</td>
                <td>
                  <div
                    className="hover:underline cursor-pointer"
                    onClick={() => editGame(element)}
                  >
                    {element.name}
                  </div>
                </td>
                <td>
                  <IconButton onClick={() => editGame(element)}>
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
    </div>
  )
}
