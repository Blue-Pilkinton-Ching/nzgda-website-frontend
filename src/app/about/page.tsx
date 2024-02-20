import Link from 'next/link'
import Background from '../background'

const classes =
  'font-bold text-3xl hover:*:underline hover:brightness-75 duration-100 *:mb-4 '

export default function Page() {
  return (
    <>
      <Link href={'/about/whowhatwhy'} className={classes}>
        <p className="inline-block">The Who, What, & Why</p>
        <br />
      </Link>
      <Link href={'/about/faq'} className={classes}>
        <p className="inline-block">Help & FAQ</p>
        <br />
      </Link>

      <Link href={'/about/privacy'} className={classes}>
        <p className="inline-block">Privacy & Safety</p>
        <br />
      </Link>
      <Link href={'/about/contact'} className={classes}>
        <p className="inline-block">Contact Us</p>
        <br />
      </Link>
    </>
  )
}
