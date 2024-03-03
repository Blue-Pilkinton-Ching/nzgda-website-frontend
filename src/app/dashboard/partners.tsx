import { IoEye, IoEyeOff } from 'react-icons/io5'
import { IconButton } from '../(components)/iconButton'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { MdDeleteForever } from 'react-icons/md'
import Confirm from './confirm'

export default function Partners({
  className,
  partners,
  invalidatePartners,
}: {
  className: string
  partners: { name: string; hidden: boolean }[]
  invalidatePartners: () => void
}) {
  const [user] = useAuthState(getAuth())

  const [partnerData, setPartnerData] =
    useState<{ name: string; hidden: boolean }[]>()
  const [confirmText, setConfirmText] = useState('')
  const [partnerToDelete, setPartnerToDelete] = useState('')

  useEffect(() => {
    setPartnerData(partners)
  }, [partners])

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

  async function deletePartner() {
    let res
    try {
      res = await fetch(`/api/dashboard/partners`, {
        body: JSON.stringify(partnerToDelete),
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while setting partner visibility')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        invalidatePartners()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('An error occured while deleting partner')
        return
    }
  }

  return (
    <div className={className}>
      <Confirm
        text={confirmText}
        onConfirm={deletePartner}
        onCancel={() => setConfirmText('')}
      />
      <h1 className="text-4xl font-bold">Partners</h1>
      <br />
      <table className="w-full">
        <thead>
          <tr>
            <th className="pl-2">Partner</th>
            <th className="w-16 text-center">Hide</th>
            <th className="w-16 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {partnerData?.map((element, key) => {
            return (
              <tr key={key} className="even:bg-zinc-100 odd:bg-white">
                <td className="pl-2">{element.name}</td>
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
                <td>
                  <IconButton
                    onClick={() => {
                      setPartnerToDelete(element.name)
                      setConfirmText(
                        'Are you sure you want to delete this partner? This action is irreversible.'
                      )
                    }}
                  >
                    <MdDeleteForever className="w-full" size={'30px'} />
                  </IconButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
