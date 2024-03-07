export default function Email() {
  return (
    <>
      <label htmlFor="email" className="w-24 text-left font-semibold mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email..."
        className="py-0.5 px-2 rounded-lg flex-1 border-white border shadow focus:border-mainred outline-none text-lg mb-3"
        required
        maxLength={50}
      />
    </>
  )
}
