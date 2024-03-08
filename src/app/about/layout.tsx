import React from 'react'
import Background from '../(components)/background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Background center>{children}</Background>
}
