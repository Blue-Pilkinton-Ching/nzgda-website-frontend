import Image from 'next/image'

import charactors from '../../../public/images/game-characters.png'
import logo from '../../../public/images/game-logo.png'

export default function Page() {
  return (
    <>
      <section className="flex justify-between items-center">
        <div>
          <br />
          <div className="w-[350px]">
            <Image quality={100} src={logo} alt="game-characters"></Image>
          </div>
          <br />
          <p className="max-w-[500px] text-lg">
            Play, laugh, and learn! HEIHEI tākaro is a safe place for our
            tamariki. Watch shows on TVNZ On Demand, or Play games right here.
          </p>
        </div>
        <div className="mr-44 my-16 ">
          <Image
            quality={75}
            src={charactors}
            alt="game-characters"
            width={400}
          ></Image>
        </div>
      </section>
    </>
  )
}
