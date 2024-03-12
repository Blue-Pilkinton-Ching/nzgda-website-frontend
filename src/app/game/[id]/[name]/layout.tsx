import React from 'react'
import GameBackground from '@/app/(components)/game-background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GameBackground>{children}</GameBackground>
    </>
  )
}
