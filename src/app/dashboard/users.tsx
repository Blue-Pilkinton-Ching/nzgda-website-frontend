import { IoCheckmarkSharp } from 'react-icons/io5'
import { IconButton } from '../(components)/iconButton'
import { AuthRequest } from '../../../types'
import { FaXmark } from 'react-icons/fa6'

export default function Users({
  className,
  authRequests,
}: {
  className: string
  authRequests: AuthRequest[]
}) {
  async function acceptAuthRequest(authRequest: AuthRequest) {}

  async function denyAuthRequest(authRequest: AuthRequest) {}

  return (
    <div className={className}>
      <h1 className="text-center text-4xl font-bold">Authorisation Requests</h1>
      <br />
      <table className="w-full">
        <thead>
          <tr className="*:p-1">
            <th>Email Address</th>
            <th className="w-14 text-center">Accept</th>
            <th className="w-14 text-center">Deny</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {authRequests.map((element, index) => {
            return (
              <tr key={index} className="*:p-1 odd:bg-white even:bg-pink-50">
                <td>
                  <div>{element.email}</div>
                </td>
                <td>
                  <IconButton
                    onClick={() => {
                      acceptAuthRequest(element)
                    }}
                  >
                    <IoCheckmarkSharp className="w-full" size={'30px'} />
                  </IconButton>
                </td>
                <td>
                  <IconButton
                    onClick={() => {
                      denyAuthRequest(element)
                    }}
                  >
                    <FaXmark className="w-full" size={'30px'} />
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
