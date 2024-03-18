'use client'

import Link from 'next/link'
import URLName from '@/utils/client/get-url-friendly-name'

import { GameListItem } from '../../../types'
import CardContent from './card-content'
import { getAnalytics, logEvent } from 'firebase/analytics'

export default function Card({ game }: { game: GameListItem }) {
  function onClick() {
    logEvent(getAnalytics(), 'click_game', {
      game_name: game.name,
      isApp: game.app || false,
      partner: game.partner || 'None',
    })
  }

  return (
    <Link
      onClick={onClick}
      key={game.id}
      href={`/game/${game.id}/${URLName(game.name)}`}
    >
      <CardContent game={game} />
    </Link>
  )
}
