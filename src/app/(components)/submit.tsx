export default function Submit({ text }: { text: string }) {
  return (
    <>
      <label className="w-min" htmlFor="login"></label>
      <input
        value={text}
        name="login"
        type="submit"
        className="w-28 p-1 rounded-xl shadow-md font-semibold text-lg bg-mainred text-white hover:scale-105 active:scale-95 cursor-pointer duration-100 mt-3"
      />
    </>
  )
}
