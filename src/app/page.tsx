import Image from 'next/image'
import banner from '../../public/images/banner-split.png'
import logo from '../../public/images/heihei-logo.png'

export default function Home() {
  return (
    <main className="w-full">
      <div className="justify-center flex">
        <div className="flex justify-between items-center min-w-[240%] sm:min-w-[1280px]">
          <div className="w-[43%]">
            <Image
              quality={100}
              className="object-contain"
              src={banner}
              alt={'Background'}
            ></Image>
          </div>
          <div className="absolute w-[20%] min-w-16 sm:w-32 left-[50%] -translate-x-1/2">
            <Image
              quality={100}
              className="object-contain"
              src={logo}
              alt={'Background'}
            ></Image>
          </div>
          <div className="w-[43%]">
            <Image
              quality={100}
              className="object-contain"
              src={banner}
              alt={'Background'}
            ></Image>
          </div>
        </div>
      </div>
    </main>
  )
}
