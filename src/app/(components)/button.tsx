import React from 'react'

import { MouseEvent } from 'react'

export default function Button({
  children,
  inverted,
  onClick,
}: {
  children: React.ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  inverted?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`py-1 px-3 hover:scale-105 duration-100 active:scale-95 text-lg font-semibold rounded-xl mt-3 shadow disabled:scale-100 disabled:brightness-75 disabled:saturate-50 ${
        inverted ? 'bg-white text-red' : 'bg-red text-white'
      }`}
    >
      {children}
    </button>
  )
}
