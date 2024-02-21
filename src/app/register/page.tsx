'use client'

import { FormEvent, useEffect, useState } from 'react'
import Background from '../(components)/background'
import Email from '../(components)/email'
import Password from '../(components)/password'
import Submit from '../(components)/submit'

import '../(utils)/firebase'

import * as auth from 'firebase/auth'

import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth'

export default function Page() {
  const [textError, setTextError] = useState('')

  const [user] = useAuthState(auth.getAuth())

  const [returnMessage, setReturnMessage] = useState('')

  const [
    createUserWithEmailAndPassword,
    createUser,
    createLoading,
    createError,
  ] = useCreateUserWithEmailAndPassword(auth.getAuth())

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
    }

    await createUserWithEmailAndPassword(inputs[0].value, inputs[1].value)

    if (createUser) {
      await auth.sendEmailVerification(createUser.user)
    }
  }

  if (createLoading && returnMessage !== `Creating account...`) {
    setReturnMessage(`Creating account...`)
  }

  if (
    createError &&
    returnMessage !==
      `The was an error creating your account. Check the console for details.`
  ) {
    console.error(createError)
    setReturnMessage(
      `The was an error creating your account. Check the console for details.`
    )
  }

  return (
    <Background>
      {returnMessage ? (
        <p className="text-2xl">{returnMessage}</p>
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
