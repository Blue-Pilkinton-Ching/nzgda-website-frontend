import Background from '../(components)/background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Background>{children}</Background>
}
