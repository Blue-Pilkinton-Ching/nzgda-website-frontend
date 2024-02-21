export default function Submit({ isLogin }: { isLogin: boolean }) {
  return (
    <>
      <label className="w-min" htmlFor="login"></label>
      <input
        value={isLogin ? 'Login' : 'Register'}
        name="login"
        type="submit"
        className="w-28 p-1 rounded-xl shadow-md text-lg bg-red text-white hover:scale-105 active:scale-95 cursor-pointer duration-100 mx-auto mt-3"
      />
    </>
  )
}
