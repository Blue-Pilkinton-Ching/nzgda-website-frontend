import { IoEye, IoEyeOff } from 'react-icons/io5'
import { IconButton } from '../(components)/iconButton'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

export default function Partners({
  className,
  partners,
}: {
  className: string
  partners: { name: string; hidden: boolean }[]
}) {
  const [user] = useAuthState(getAuth())

  useEffect(() => {
    setPartnerData(partners)
  }, [partners])

  const [partnerData, setPartnerData] =
    useState<{ name: string; hidden: boolean }[]>()

  async function onToggleVisibility(partner: {
    name: string
    hidden: boolean
  }) {
    const shouldHide = !partner.hidden

    let res

    setPartnerData(
      partnerData?.map((x) => {
        if (x.name === partner.name) {
          x.hidden = shouldHide
        }
        return x
      })
    )

    try {
      res = await fetch(`/api/dashboard/partners`, {
        body: JSON.stringify({ hidden: shouldHide, name: partner.name }),
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while setting partner visibility')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while setting partner visibility')
        return
    }
  }

  return (
    <div className={className}>
      <table className="w-full">
        <tr>
          <th>Partner</th>
          <th className="w-16 text-center">Hide</th>
        </tr>
        {partnerData?.map((element, key) => {
          return (
            <tr key={key} className="odd:bg-zinc-100">
              <td>{element.name}</td>
              <td>
                <IconButton
                  onClick={() => {
                    onToggleVisibility(element)
                  }}
                >
                  {element.hidden ? (
                    <IoEyeOff className="w-full" size={'30px'} />
                  ) : (
                    <IoEye className="w-full" size={'30px'} />
                  )}
                </IconButton>
              </td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}
