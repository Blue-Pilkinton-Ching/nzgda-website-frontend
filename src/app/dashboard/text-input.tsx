import { ChangeEvent, useEffect, useState } from 'react'

export default function TextInput({
  required = false,
  name,
  type = 'text',
  tooltip,
  value,
}: {
  required?: boolean
  name: string
  type?: string
  tooltip?: string
  value: string
}) {
  const [currentValue, setCurrentValue] = useState('')

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  function onChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCurrentValue(event.target.value)
  }

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
            onChange={onChange}
            value={currentValue}
            required={required}
            name={name}
            rows={10}
            className="py-0.5 px-2 rounded-lg flex-1 border-white border shadow focus:border-red outline-none text-lg"
          ></textarea>
        ) : (
          <input
            onChange={onChange}
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
