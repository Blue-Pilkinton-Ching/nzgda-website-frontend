'use client'

import { FormEvent, useEffect, useState } from 'react'
import Background from '../(components)/background'
import Email from '../(components)/email'
import Password from '../(components)/password'
import Submit from '../(components)/submit'

import { MouseEvent } from 'react'

import '../(utils)/firebase'

import * as auth from 'firebase/auth'

import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth'
import { usePathname, useRouter } from 'next/navigation'
import Button from '../(components)/button'

export default function Page() {
  const [textError, setTextError] = useState('')
  const [user] = useAuthState(auth.getAuth())
  const [returnMessage, setReturnMessage] = useState('')
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  const [sendEmailVerification, verifyLoading, verifyError] =
    useSendEmailVerification(auth.getAuth())

  const [
    createUserWithEmailAndPassword,
    createUser,
    createLoading,
    createError,
  ] = useCreateUserWithEmailAndPassword(auth.getAuth(), {})

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const inputs = Array.from(form.elements).filter(
      (element) => element.tagName === 'INPUT'
    ) as HTMLInputElement[]

    if (inputs[1].value !== inputs[2].value) {
      inputs[1].value = ''
      inputs[2].value = ''

      setTextError((old) => {
        return old === `Passwords don't match`
          ? `Passwords still don't match`
          : `Passwords don't match`
      })
      return
    }

    const newUserCredential = await createUserWithEmailAndPassword(
      inputs[0].value,
      inputs[1].value
    )

    if (newUserCredential && newUserCredential.user) {
      sendEmailVerification()
    }
  }

  function onSendNewEmail(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget

    button.disabled = true

    setTimeout(() => {
      button.disabled = false
    }, 70000)

    sendEmailVerification()
  }

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user?.emailVerified) {
      setVerified(true)
    }

    const checkEmailVerified = async () => {
      if (user) {
        await user.reload() // This reloads the user's profile from Firebase
        if (user.emailVerified) {
          setVerified(true)
          clearInterval(interval)
        }
      }
    }

    const interval = setInterval(checkEmailVerified, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (createLoading) {
      setReturnMessage(`Creating account...`)
    }
  }, [createLoading])

  useEffect(() => {
    if (createError) {
      console.error(createError)
      setReturnMessage(
        `The was an error creating your account. Check the console for details.
      ${createError.message}`
      )
    }
  }, [createError])

  useEffect(() => {
    if (verifyLoading) {
      setReturnMessage('Sending Verification Email...')
    }
  }, [verifyLoading])

  useEffect(() => {
    if (verifyError) {
      console.log(verifyError)
      setReturnMessage(`Sending Verification Email Failed. Check the console for details.
        ${verifyError.message}`)
    }
  }, [verifyError])

  return (
    <Background>
      {user ? (
        verified ? (
          <>
            <h1 className="text-4xl font-bold">Registration complete!</h1>
            <br />
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </>
        ) : (
          <div className="max-w-[400px] mx-auto space-y-1">
            <h1 className="text-4xl font-bold">You&apos;re almost there!</h1>
            <br />
            <h2 className="text-lg">We sent an email to</h2>
            <h3 className="text-lg font-semibold">{user.email}</h3>
            <br />
            <p>
              Just click on the link sent inside the email to complete your
              registration. If you don&apos;t see it, you may need to
              <b> check your spam </b>
              folder.
            </p>
            <br />
            <Button onClick={onSendNewEmail}> Resend Verification Email</Button>
          </div>
        )
      ) : returnMessage ? (
        <p className="text-2xl max-w-[800px] mx-auto">{returnMessage}</p>
      ) : (
        <>
          <p className="mb-3">{textError}</p>
          <form
            action={undefined}
            onSubmit={onFormSubmit}
            className="flex flex-col max-w-[300px] mx-auto"
          >
            <Email />
            <Password confirm={false} />
            <Password confirm />
            <Submit isLogin={false} />
          </form>
        </>
      )}
    </Background>
  )
}
