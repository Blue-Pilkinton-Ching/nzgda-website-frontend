import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HEIHEI Games',
  description:
    'Play, laugh, and learn! HEIHEI tākaro is a safe place for our tamariki. Watch shows on TVNZ On Demand, or Play games right here.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-auto">
      <body className={`${rubik.className} bg-white overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
