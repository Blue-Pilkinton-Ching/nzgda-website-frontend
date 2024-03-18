import Link from 'next/link'
import { GameListItem, GamesList } from '../../../types'
import * as firestore from 'firebase/firestore'
import Image from 'next/image'
import urlName from '@/utils/client/get-url-friendly-name'
import charactors from '../../../public/images/game-characters.png'

export default async function Feature() {
  let feature: GameListItem | undefined = undefined

  let data: GamesList
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
      console.error('Data not on firebase for some reason')
      throw 'Data not on firebase for some reason'
    }
    feature = data.data.find((element) => element.featured)
  } catch (error) {
    console.error(error)
  }

  return (
    <>
      {feature != undefined ? (
        <div className="hover:cursor-pointer aspect-video h-full w-full max-h-[315px] hidden lg:block">
          <Link
            href={`/game/${feature.id}/${urlName(feature.name)}`}
            className=""
          >
            <div className="relative aspect-video max-h-[315px] h-full w-auto float-right hover:scale-[1.03] active:scale-100 duration-100">
              <Image
                quality={100}
                src={
                  feature.banner ||
                  `https://placehold.co/506x400.jpg?text=Placeholder`
                }
                alt="Placeholder"
                height={315}
                width={600}
                className="shadow-md rounded-xl w-auto h-full aspect-video"
              ></Image>
              <div className="absolute w-full bottom-0 lg:h-[72px] h-14 bg-gradient-to-t from-10% via-75% from-maingreen/90 via-maingreen/75 0 to-maingreen/0 rounded-b-lg">
                <div className="text-white drop-shadow-md translate-y-1 gap-1.5 flex text-center px-3 items-center justify-center w-full h-full my-auto text-2xl">
                  <p className="font-thin drop-shadow-md">Featured</p>
                  <p className="font-semibold drop-shadow-md">Game</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="xl:mr-44 lg:mr-[12%] my-16 hidden sm:block float-right">
          <Image
            quality={75}
            src={charactors}
            alt="game-characters"
            width={400}
          ></Image>
        </div>
      )}
    </>
  )
}
