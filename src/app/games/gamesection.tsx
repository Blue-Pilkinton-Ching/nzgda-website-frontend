import { useWindowSize } from '@uidotdev/usehooks'
import { GameListItem } from '../../../types'
import Card from './card'

export default function GameSection({ games }: { games: GameListItem[] }) {
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
    <section
      className="flex justify-evenly lg:gap-x-3 gap-x-2 flex-wrap"
      style={
        typeof window !== 'undefined' && width ? { rowGap: flexGap() } : {}
      }
    >
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
    </section>
  )
}
