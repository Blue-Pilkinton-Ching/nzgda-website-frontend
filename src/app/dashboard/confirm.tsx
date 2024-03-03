import Button from '../(components)/button'

export default function Confirm({
  text,
  onConfirm,
  onCancel,
}: {
  text: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className={`w-full z-20 h-full top-0 left-0 backdrop-blur-sm ${
        text ? 'fixed' : 'hidden'
      }`}
    >
      <div
        className="w-full h-full flex justify-center items-center"
        onClick={onCancel}
      >
        <div className="w-[320px] bg-zinc-50 shadow-xl rounded-xl text-center">
          <div className="w-full h-full shadow-md p-5 rounded-xl ">
            <p className="font-bold text-2xl">Warning!</p>
            <p className="font-semibold text-lg">{text}</p>
            <div className="flex justify-evenly">
              <Button
                onClick={() => onConfirm}
                inverted
                className="bg-black text-white"
                invertedClassName="bg-white text-black"
              >
                Yes, continue
              </Button>
              <Button
                onClick={() => onCancel}
                className="bg-black text-white"
                invertedClassName="bg-white text-black"
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
