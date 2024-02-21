import React from 'react'

import { MouseEvent } from 'react'

export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      onClick={onClick}
      className="py-1 px-3 hover:scale-105 duration-100 active:scale-95 text-white text-lg font-semibold rounded-lg shadow-md bg-red"
    >
      {children}
    </button>
  )
}
