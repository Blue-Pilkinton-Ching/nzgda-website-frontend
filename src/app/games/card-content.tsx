import Link from 'next/link'
import Image from 'next/image'

import URLName from '@/utils/client/get-url-friendly-name'

import ispy from '../../../public/images/I-Spyportrait.png'
import { GameListItem } from '../../../types'

export default function CardContent({ game }: { game: GameListItem }) {
  return (
    <div className="relative rounded-lg lg:max-w-[150px] lg:h-[200px] max-w-[135px] h-[180px] flex shadow-md hover:cursor-pointer hover:scale-105 duration-100 active:scale-95">
      <Image
        src={game.name === 'I_SPY' ? ispy : game.thumbnail}
        alt={game.name}
        width={150}
        height={200}
        className="rounded-lg hidden lg:inline"
      ></Image>
      <Image
        src={game.name === 'I_SPY' ? ispy : game.thumbnail}
        alt={game.name}
        width={135}
        height={180}
        className="rounded-lg lg:hidden"
      ></Image>
      {game.app ? (
        <div className="bg-maingreen absolute w-11 h-7 bottom-0 right-0 z-10 rounded-br-lg rounded-tl-lg text-white text-xs font-semibold">
          <p className="text-center items-center justify-center h-full flex">
            App
          </p>
        </div>
      ) : null}
    </div>
  )
}
