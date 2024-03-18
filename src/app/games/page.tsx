import Image from 'next/image'

import logo from '../../../public/images/game-logo.png'
import Games from './games'
import { Suspense } from 'react'
import GameBackground from '../(components)/game-background'
import SideContent from './side-content'

export default function Page() {
  return (
    <>
      <GameBackground>
        <section className="flex justify-between items-center gap-4 xl:h-[500px] lg:h-[400px] h-[350px]">
          <div className="lg:min-w-[500px] min-w-[300px] w-min">
            <div className="lg:w-[350px] min-w-[240px] w-full">
              <Image quality={100} src={logo} alt="game-characters"></Image>
            </div>
            <br />
            <p className="lg:max-w-[500px] sm:max-w-[350px] lg:text-lg mb-5 sm:mb-0">
              Play, laugh, and learn! HEIHEI tākaro is a safe place for our
              tamariki. Watch shows on TVNZ On Demand, or Play games right here.
            </p>
          </div>
          <div className="flex-1 hidden sm:block">
            <SideContent />
          </div>
        </section>
        <section>
          <Suspense>
            <Games />
          </Suspense>
        </section>
      </GameBackground>
    </>
  )
}
