import { ChangeEvent, useEffect, useState } from 'react'

export default function Input({
  required = false,
  name,
  type = 'text',
  tooltip,
  value,
  maxLength,
  onChange,
}: {
  required?: boolean
  name: string
  type?: string
  tooltip?: string
  value: string | boolean
  maxLength: number
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => void
}) {
  const [currentValue, setCurrentValue] = useState<string | boolean>('')

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <>
      <div
        className={`${
          type === 'checkbox'
            ? 'flex-row-reverse start justify-end'
            : 'flex-col'
        } flex mb-3`}
      >
        <div
          className={`flex flex-col ${
            type === 'checkbox' ? 'translate-y-2.5' : ''
          }`}
        >
          <label htmlFor={name} className="text-left text-base font-bold mb-1">
            {name}
          </label>
          <p className={`text-zinc-500 text-sm mb-3 `}>{tooltip}</p>
        </div>
        {type === 'textarea' ? (
          <textarea
            onChange={(event) => onChange(event, name)}
            value={currentValue as string}
            required={required}
            name={name}
            maxLength={maxLength}
            id={name}
            rows={10}
            className="py-0.5 px-2 rounded-lg flex-1 border border-zinc-400 shadow-md focus:border-black outline-none text-lg"
          ></textarea>
        ) : (
          <input
            onChange={(event) => onChange(event, name)}
            value={currentValue as string}
            type={type}
            checked={currentValue as boolean}
            maxLength={maxLength}
            name={name}
            id={name}
            required={required}
            className={`py-0.5 px-2 rounded-lg border-zinc-400 border focus:border-black outline-none text-lg ${
              type === 'checkbox'
                ? 'mx-4 -mt-0.5 scale-[200%]'
                : 'shadow-md flex-1 mb-3 '
            }`}
          />
        )}
      </div>
    </>
  )
}
