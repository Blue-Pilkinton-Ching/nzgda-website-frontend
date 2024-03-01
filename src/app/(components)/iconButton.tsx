export function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-10 block hover:scale-110 active:scale-95 duration-100"
    >
      {children}
    </button>
  )
}
