import React from 'react'

import Footer from './footer'
import Header from './header'

export default function Background({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-svw min-h-dvh flex-col flex justify-between">
      <Header />
      <main className="text-center mx-auto text-red w-[90%]">{children}</main>
      <Footer />
    </div>
  )
}
