import Image from 'next/image'

import logo from '../../../public/images/game-logo.png'
import Games from './games'
import { Suspense } from 'react'
import GameBackground from '../(components)/game-background'
import Feature from './feature'

export default function Page() {
  return (
    <>
      <GameBackground>
        <section className="flex justify-between items-center">
          <div>
            <div className="lg:w-[350px] min-w-[240px] w-[65%]">
              <Image quality={100} src={logo} alt="game-characters"></Image>
            </div>
            <br />
            <p className="lg:max-w-[500px] sm:max-w-[350px] lg:text-lg mb-5 sm:mb-0">
              Play, laugh, and learn! HEIHEI tākaro is a safe place for our
              tamariki. Watch shows on TVNZ On Demand, or Play games right here.
            </p>
          </div>
          <div className="xl:mr-44 lg:mr-[6%] my-16 hidden sm:block">
            <Feature />
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
