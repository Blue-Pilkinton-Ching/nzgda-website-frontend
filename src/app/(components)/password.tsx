export default function Password({ confirm }: { confirm: boolean }) {
  return (
    <>
      <label
        className="w-24 text-left font-semibold"
        htmlFor={confirm ? 'confirm-password' : 'password'}
      >
        Password
      </label>
      <input
        type="password"
        name={confirm ? 'confirm-password' : 'password'}
        placeholder={
          confirm ? 'Confirm your password...' : 'Enter your password...'
        }
        className="py-0.5 px-2 rounded-lg flex-1 border-white border shadow focus:border-red outline-none text-lg mb-3"
        minLength={8}
        maxLength={30}
        security=""
        required
      />
    </>
  )
}
