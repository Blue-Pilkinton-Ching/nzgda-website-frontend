import Image from 'next/image'
import React from 'react'
import background from '../../../public/images/game-background.png'
import Footer from '../footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute right-0 w-[40%] lg:w-fit -z-10">
        <Image quality={100} src={background} alt={'background'}></Image>
      </div>
      <div className="sm:p-10 p-5 min-h-svh h-max">{children}</div>
      <Footer />
    </>
  )
}
