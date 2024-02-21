'use client'

import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import Background from '../(components)/background'
import Email from '../(components)/email'
import Password from '../(components)/password'
import Submit from '../(components)/submit'
import { getAuth } from 'firebase/auth'
import { FormEvent, useEffect, useState } from 'react'

import '../(utils)/firebase'
import { useRouter } from 'next/navigation'
import Button from '../(components)/button'

export default function Page() {
  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] =
    useSignInWithEmailAndPassword(getAuth())

  const [returnMessage, setReturnMessage] = useState('')
  const [textError, setTextError] = useState('')

  const router = useRouter()

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const inputs = Array.from(form.elements).filter(
      (element) => element.tagName === 'INPUT'
    ) as HTMLInputElement[]

    await signInWithEmailAndPassword(inputs[0].value, inputs[1].value)
  }

  useEffect(() => {
    if (signInError && returnMessage) {
      setReturnMessage(``)
      return
    }

    if (signInLoading) {
      setReturnMessage(`Signing in...`)
    }
  }, [signInLoading, signInError, returnMessage])

  useEffect(() => {
    if (signInError) {
      setTextError(`Error Signing in: ${signInError?.message}`)
    }
  }, [signInError])

  return (
    <Background>
      {signInUser ? (
        <>
          <h1 className="text-4xl font-bold">Sign in complete!</h1>
          <br />
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </>
      ) : returnMessage ? (
        <p className="text-2xl max-w-[800px] mx-auto">{returnMessage}</p>
      ) : (
        <>
          <p className="mb-3">{textError}</p>
          <form
            onSubmit={onFormSubmit}
            className="flex flex-col max-w-[300px] mx-auto"
          >
            <Email />
            <Password confirm={false} />
            <Submit isLogin />
          </form>
        </>
      )}
    </Background>
  )
}
