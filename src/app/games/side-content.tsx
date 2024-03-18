import Image from 'next/image'

import '@/utils/client/firebase'

import charactors from '../../../public/images/game-characters.png'

import Feature from './feature'
import { Suspense } from 'react'

export default function SideContent() {
  return (
    <>
      <Suspense
        fallback={
          <div className="xl:mr-44 lg:mr-[12%] my-16 hidden sm:block float-right">
            <Image
              quality={75}
              src={charactors}
              alt="game-characters"
              width={400}
            ></Image>
          </div>
        }
      >
        <Feature />
      </Suspense>
    </>
  )
}
