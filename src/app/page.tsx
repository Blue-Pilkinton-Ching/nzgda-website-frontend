import Image from 'next/image'
import banner from '../../public/images/banner-split.png'
import logo from '../../public/images/heihei-logo.png'
import bannerBottom from '../../public/images/footer-side.png'
import tvnz from '../../public/images/tvnz-logo.png'
import nzonair from '../../public/images/nzonair-logo.png'
import play from '../../public/images/play.png'
import games from '../../public/images/games.png.png'

export default function Home() {
  return (
    <main className="w-full h-dvh flex-col flex justify-between">
      <div className="justify-center flex">
        <div className="flex justify-between items-center min-w-[240%] sm:min-w-[1280px]">
          <div className="w-[43%]">
            <Image
              quality={100}
              src={banner}
              alt={'Background'}
              priority
            ></Image>
          </div>
          <div className="absolute w-[20%] min-w-16 sm:w-32 left-[50%] -translate-x-1/2">
            <Image quality={100} src={logo} alt={'Background'}></Image>
          </div>
          <div className="w-[43%]">
            <Image quality={100} src={banner} alt={'Background'}></Image>
          </div>
        </div>
      </div>
      <div className="text-center mx-auto text-red w-[400px]">
        <h1 className="text-4xl font-bold ">Kia Ora!</h1>
        <h2 className="font-medium text-red mb-4 mt-1">Welcome to HEIHEI!</h2>
        <p>
          Play, laugh, and learn! HEIHEI tākaro is a safe place for our
          tamariki. Watch shows on TVNZ On Demand, or Play games right here.
        </p>
        <br />
        <div className="w-32 mx-auto flex justify-center gap-8">
          <Image quality={100} src={play} alt={'Background'}></Image>
          <Image quality={100} src={play} alt={'Background'}></Image>
        </div>
        <br />
      </div>
      <div className="justify-center flex">
        <div className="flex justify-between items-center min-w-[300%] sm:min-w-[1700px]">
          <div className="w-[40%] translate-y-1/3 scale-125">
            <Image quality={100} src={bannerBottom} alt={'Background'}></Image>
          </div>
          <div className="absolute w-[35%] sm:w-44 left-[50%] -translate-x-1/2 translate-y-1/4">
            <div className="flex justify-center gap-[20%]">
              <div>
                <Image quality={100} src={tvnz} alt={'Background'}></Image>
              </div>
              <div>
                <Image quality={100} src={nzonair} alt={'Background'}></Image>
              </div>
            </div>
          </div>
          <div className="w-[40%]  translate-y-1/3 scale-125">
            <Image quality={100} src={bannerBottom} alt={'Background'}></Image>
          </div>
        </div>
      </div>
    </main>
  )
}
