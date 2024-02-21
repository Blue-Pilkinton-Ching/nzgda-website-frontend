'use client'

import { FormEvent, useEffect, useState, MouseEvent } from 'react'
import Background from '../(components)/background'
import Button from '../(components)/button'
import Email from '../(components)/email'
import Submit from '../(components)/submit'
import { useRouter } from 'next/navigation'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

import '../(utils)/firebase'

export default function ResetPassword() {
  const router = useRouter()

  const [sendPasswordResetEmail, passwordLoading, passwordError] =
    useSendPasswordResetEmail(getAuth())

  const [textError, setTextError] = useState('')
  const [returnMessage, setReturnResult] = useState('')

  const [resetEmailSent, setResetSent] = useState('')

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const inputs = Array.from(form.elements).filter(
      (element) => element.tagName === 'INPUT'
    ) as HTMLInputElement[]

    const reset = await sendPasswordResetEmail(inputs[0].value)

    if (reset) {
      setResetSent(inputs[0].value)
    }
  }

  function onSendPasswordResetEmail(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget

    if (!button.disabled) {
      button.disabled = true

      setTimeout(() => {
        button.disabled = false
      }, 120000)

      sendPasswordResetEmail(resetEmailSent)
    }
  }

  useEffect(() => {
    if (passwordLoading) {
      setReturnResult('Sending Reset Email...')
    } else if (returnMessage === 'Sending Reset Email...') {
      setReturnResult('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordLoading])

  useEffect(() => {
    if (passwordError) {
      console.log(passwordError)
      setReturnResult('')
      setTextError(
        `Error sending password reset email: ${passwordError.message}`
      )
    }
  }, [passwordError])

  return (
    <Background>
      {returnMessage ? (
        <p className="text-2xl max-w-[800px] mx-auto">{returnMessage}</p>
      ) : resetEmailSent ? (
        <div className="max-w-[400px] mx-auto space-y-1">
          <h1 className="text-4xl font-bold">You&apos;re almost there!</h1>
          <br />
          <h2 className="text-lg">We sent a password reset email to</h2>
          <h3 className="text-lg font-semibold">{resetEmailSent}</h3>
          <br />
          <p>
            Just click on the link sent inside the email to reset your password.
            If you don&apos;t see it, you may need to
            <b> check your spam </b>
            folder.
          </p>
          <br />
          <Button onClick={onSendPasswordResetEmail}>
            Resend Password reset Email
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-3">{textError}</p>

          <form
            onSubmit={onFormSubmit}
            className="flex flex-col max-w-[300px] mx-auto"
          >
            <Email />
            <div className="flex gap-3">
              <Submit text={'Reset'} />
              <Button inverted onClick={() => router.push('/login')}>
                Back to Login
              </Button>
            </div>
          </form>
        </>
      )}
    </Background>
  )
}
