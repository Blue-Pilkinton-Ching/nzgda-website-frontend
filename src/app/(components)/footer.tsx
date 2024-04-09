import React from 'react'

import Image from 'next/image'
import bannerBottom from '../../../public/images/footer-side.png'
import nzonair from '../../../public/images/nzonair-logo.png'
import nzgda from '../../../public/images/NZGDA.png'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="justify-center flex">
      <div className="flex justify-between items-center min-w-[300%] sm:min-w-[1700px]">
        <div className="w-[40%] translate-y-1/3 scale-125">
          <Image quality={100} src={bannerBottom} alt={'Background'}></Image>
        </div>
        <div className="absolute w-[35%] sm:w-44 left-[50%] -translate-x-1/2 translate-y-1/4">
          <Link
            href={'/about'}
            className="flex justify-center hover:scale-105 duration-100 items-center gap-[10%] *:text-mainred *:font-semibold *:text-xl hover:*:underline hover:*:cursor-pointer"
          >
            <div>
              <Image quality={100} src={nzgda} alt={'Background'}></Image>
            </div>
            <div>
              <Image quality={100} src={nzonair} alt={'Background'}></Image>
            </div>
          </Link>
        </div>
        <div className="w-[40%]  translate-y-1/3 scale-125">
          <Image quality={100} src={bannerBottom} alt={'Background'}></Image>
        </div>
      </div>
    </footer>
  )
}
