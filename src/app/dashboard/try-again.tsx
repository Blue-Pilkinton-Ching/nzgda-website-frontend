import Button from '../(components)/button'

export default function TryAgain({
  onButtonClick,
}: {
  onButtonClick: () => void
}) {
  return <Button onClick={onButtonClick}>Try Again</Button>
}
