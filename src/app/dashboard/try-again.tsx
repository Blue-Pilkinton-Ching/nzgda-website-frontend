import Button from '../(components)/button'

export default function TryAgain({
  onButtonClick,
}: {
  onButtonClick: () => void
}) {
  return (
    <div className="block w-full">
      <Button onClick={onButtonClick}>Try Again</Button>
    </div>
  )
}
