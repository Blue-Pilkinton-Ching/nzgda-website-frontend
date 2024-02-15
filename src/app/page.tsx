import Background from './background'
import play from '../../public/images/play.png'
import games from '../../public/images/games.png'
import watch from '../../public/images/watch.png'
import tv from '../../public/images/mataki.png'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <Background>
      <h1 className="text-4xl font-bold ">Kia Ora!</h1>
      <h2 className="font-medium text-red mb-4 mt-1">Welcome to HEIHEI!</h2>
      <p>
        Play, laugh, and learn! HEIHEI tākaro is a safe place for our tamariki.
        Watch shows on TVNZ On Demand, or Play games right here.
      </p>
      <br />
      <div className="w-64 mx-auto flex justify-center gap-8 *:relative *:hover:cursor-pointer active:*:scale-95 *:duration-100">
        <Link href={'https://www.tvnz.co.nz/categories/heihei'} target="_blank">
          <div className="hover:opacity-0 duration-300 bg-white absolute">
            <Image src={tv} alt={'Background'} />
          </div>
          <div>
            <Image src={watch} alt={'Background'} />
          </div>
        </Link>
        <Link href={'/games'}>
          <div className="hover:opacity-0 duration-300 bg-white absolute">
            <Image src={games} alt={'Background'} />
          </div>
          <div>
            <Image src={play} alt={'Background'} />
          </div>
        </Link>
      </div>
      <br />
    </Background>
  )
}
