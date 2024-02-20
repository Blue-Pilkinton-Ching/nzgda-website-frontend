import React from 'react'
import Background from '../background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Background>{children}</Background>
}
