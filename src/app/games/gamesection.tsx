import { useWindowSize } from '@uidotdev/usehooks'
import { GameListItem } from '../../../types'
import Card from './card'
import React from 'react'
import { ScrollableGamesSection } from './scrollable-games-section'

export default function GameSection({
  games,
  smallTitle,
  largeTitle,
  titleChildren,
  scrollable = false,
}: {
  games: GameListItem[]
  smallTitle: string
  largeTitle: string
  titleChildren?: React.ReactNode
  scrollable?: boolean
}) {
  const { width } = useWindowSize()

  const containerWidth = () => {
    const padding = (width as number) >= 640 ? 80 : 40

    return (width as number) - padding
  }

  const flexGap = () => {
    const cardWidth = (width as number) >= 1024 ? 150 : 135
    return (containerWidth() - cardsPerRow() * cardWidth) / (cardsPerRow() + 1)
  }

  const cardsPerRow = () => {
    const cardWidth = (width as number) >= 1024 ? 150 : 135
    const gap = (width as number) >= 1024 ? 12 : 8

    return Math.floor((containerWidth() + gap) / (cardWidth + gap))
  }

  return (
    <>
      <div className="flex justify-between sm:items-center gap-0 sm:gap-3 flex-col-reverse sm:flex-row">
        <h3 className="text-3xl font-bold sm:hidden block text-maingreen">
          {smallTitle}
        </h3>
        <h3 className="text-3xl font-bold hidden sm:block text-maingreen">
          {largeTitle}
        </h3>
        <br />
        {titleChildren}
      </div>
      <br />
      {scrollable ? (
        <ScrollableGamesSection
          cards={
            <>
              {games.map((element) => (
                <Card key={element.id} game={element} />
              ))}{' '}
            </>
          }
        />
      ) : (
        <section
          className="flex justify-evenly lg:gap-x-3 gap-x-2 flex-wrap"
          style={
            typeof window !== 'undefined' && width ? { rowGap: flexGap() } : {}
          }
        >
          {games.length > 0 ? (
            <>
              {games.map((element) => (
                <Card key={element.id} game={element} />
              ))}
              {games.length % cardsPerRow() !== 0
                ? Array(cardsPerRow() - (games.length % cardsPerRow()))
                    .fill(0)
                    .map((_, i) => (
                      <div
                        className={`lg:w-[150px] w-[135px] h-[180px] lg:h-[200px]`}
                        key={i}
                      ></div>
                    ))
                : null}
            </>
          ) : (
            <>
              <div className="h-[180px] flex items-center justify-center">
                <p className="text-neutral-400 text-2xl font-bold">
                  Couldn&apos;t find any educational games!
                </p>
              </div>
            </>
          )}
        </section>
      )}
    </>
  )
}
