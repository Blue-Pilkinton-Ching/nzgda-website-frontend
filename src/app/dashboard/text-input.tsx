import { ChangeEvent, useEffect, useState } from 'react'

export default function TextInput({
  required = false,
  name,
  type = 'text',
  tooltip,
  value,
  onChange,
}: {
  required?: boolean
  name: string
  type?: string
  tooltip?: string
  value: string
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => void
}) {
  const [currentValue, setCurrentValue] = useState('')

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <>
      <div className="flex flex-col mb-3">
        <p className="text-red text-sm">{tooltip}</p>
        <label
          htmlFor={name}
          className="w-32 text-left text-base font-bold mb-1"
        >
          {name}
        </label>
        {type === 'textarea' ? (
          <textarea
            onChange={(event) => onChange(event, name)}
            value={currentValue}
            required={required}
            name={name}
            rows={10}
            className="py-0.5 px-2 rounded-lg flex-1 border-white border shadow focus:border-red outline-none text-lg"
          ></textarea>
        ) : (
          <input
            onChange={(event) => onChange(event, name)}
            value={currentValue}
            type="text"
            name={name}
            required={required}
            className="py-0.5 px-2 rounded-lg flex-1 border-white border shadow focus:border-red outline-none text-lg"
          />
        )}
      </div>
    </>
  )
}
