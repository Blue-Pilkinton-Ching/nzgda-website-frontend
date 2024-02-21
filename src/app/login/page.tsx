'use client'

import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth'
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

  const [user, userLoading, userError] = useAuthState(getAuth())

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
    if (user && user.emailVerified) {
      router.push('/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (signInLoading) {
      setReturnMessage(`Signing in...`)
    } else if (returnMessage === `Signing in...`) {
      setReturnMessage(``)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInLoading])

  useEffect(() => {
    if (signInError) {
      setReturnMessage(``)
      setTextError(`Error Signing in user: ${signInError?.message}`)
    }
  }, [signInError])

  useEffect(() => {
    if (userLoading) {
      setReturnMessage(`User loading...`)
    } else if (returnMessage === `User loading...`) {
      setReturnMessage(``)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading])

  useEffect(() => {
    if (userError) {
      setReturnMessage(``)
      setTextError(`Error loading user: ${userError?.message}`)
    }
  }, [userError])

  return (
    <Background>
      {user ? (
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
