import Background from './background'
import play from '../../public/images/play.png'
import games from '../../public/images/games.png'
import watch from '../../public/images/watch.png'
import tv from '../../public/images/mataki.png'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/games')
}
