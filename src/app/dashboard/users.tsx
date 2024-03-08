'use client'

import { IconButton } from '../(components)/iconButton'
import { User, UserTypes } from '../../../types'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import { MdDeleteForever } from 'react-icons/md'
import Confirm from './confirm'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser, getAuth } from 'firebase/auth'

export default function Users({
  className,
  authRequests,
  users,
  invalidateUsers,
}: {
  className: string
  authRequests: User[]
  users: UserTypes
  invalidateUsers: () => void
}) {
  const [confirmText, setConfirmText] = useState('')
  const [confirmAction, setConfirmAction] = useState<() => void>()

  const [user] = useAuthState(getAuth())

  async function acceptAuthRequest(authRequest: User) {
    let res
    try {
      res = await fetch(`/api/dashboard/users`, {
        body: JSON.stringify({ user: authRequest }),
        method: 'POST',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while adding user')
      console.error(error)
      return
    }
    switch (res.status) {
      case 200:
        invalidateUsers()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('A server error occured while adding user')
        return
    }
  }

  async function deleteUser(deletedUser: User) {
    let res
    try {
      res = await fetch(`/api/dashboard/users`, {
        body: JSON.stringify({ user: deletedUser }),
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + (await user?.getIdToken(true)) },
      })
    } catch (error) {
      alert('An error occured while adding user')
      console.error(error)
      return
    }

    switch (res.status) {
      case 200:
        invalidateUsers()
        return
      case 401:
        alert('You are Unauthorized to make that action')
        return
      case 500:
        alert('A server error occured while deleting user')
        return
    }
  }

  async function denyAuthRequest(authRequest: User) {}

  return (
    <>
      <div className={className}>
        <Confirm
          text={confirmText}
          onConfirm={confirmAction || (() => {})}
          onCancel={() => setConfirmText('')}
        />
        <h1 className="pl-2 text-4xl font-bold">User Requests</h1>
        <br />
        <table className="w-full ">
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
                        setConfirmAction(() => {
                          return () => {
                            acceptAuthRequest(element)
                          }
                        })
                        setConfirmText(
                          'Are you sure you want to add this user?'
                        )
                      }}
                    >
                      <FaCheck className="w-full" size={'30px'} />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton
                      onClick={() => {
                        setConfirmAction(() => {
                          return () => {
                            denyAuthRequest(element)
                          }
                        })
                        setConfirmText(
                          'Are you sure you want to deny this users request?'
                        )
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
      <br />
      <br />
      <div className={className}>
        <h1 className="pl-2 text-4xl font-bold">Current Users</h1>
        <br />
        <table className="w-full ">
          <thead>
            <tr className="*:p-1">
              <th className="w-24 text-center">Privilege</th>
              <th>Email Address</th>
              <th className="w-14 text-center">Revoke</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {users.admins.map((element, index) => {
              return (
                <tr key={index} className="*:p-1 odd:bg-white even:bg-pink-50">
                  <td className="w-24">
                    <p className="text-center font-semibold">Admin</p>
                  </td>
                  <td>
                    <div>{element.email}</div>
                  </td>
                  <td>
                    <div className="h-10"></div>
                  </td>
                </tr>
              )
            })}
            {users.privileged.map((element, index) => {
              return (
                <tr key={index} className="*:p-1 odd:bg-white even:bg-pink-50">
                  <td className="w-24 h-10 my-1">
                    <p className="text-center font-semibold">Privileged</p>
                  </td>
                  <td>
                    <div>{element.email}</div>
                  </td>
                  <td>
                    <IconButton
                      onClick={() => {
                        setConfirmAction(() => {
                          return () => {
                            deleteUser(element)
                          }
                        })
                        setConfirmText(
                          'Are you sure you want to revoke the Authorization of this user? This action is irreversible.'
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
    </>
  )
}
