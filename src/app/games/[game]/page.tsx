export default function Page({ params }: { params: { game: string } }) {
  return <>{params.game}</>
}
