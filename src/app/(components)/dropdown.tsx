import Link from 'next/link'

export default function Dropdown({ options }: { options: string[] }) {
  return (
    <>
      <div className="relative pb-2 group/button cursor-pointer">
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className="text-white bg-maingreen focus:ring-4 ring-green-200 peer/button hover:ring-4 group-hover/button:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          Filter by Studio{' '}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          id="dropdown"
          className="my-2 inset-x-0 mx-auto absolute z-10 hidden peer-focus/button:block group-hover/button:block hover:block bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul
            className="py-2 text-sm text-maingreen shadow-md"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Link
                href={`/games`}
                className="block px-4 py-2 font-semibold hover:bg-neutral-100"
              >
                None
              </Link>
            </li>
            {options.map((option) => (
              <li key={option}>
                <Link
                  href={`/games?partner=${encodeURIComponent(option)}`}
                  className="block px-4 py-2 hover:bg-neutral-100"
                >
                  {option}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
