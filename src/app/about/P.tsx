import React from 'react'

export default function P({ children }: { children: React.ReactNode }) {
  return <p className="text-md mb-6 text-justify">{children}</p>
}
