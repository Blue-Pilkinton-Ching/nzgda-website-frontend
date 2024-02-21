'use client'

import Background from '../(components)/background'
import Email from '../(components)/email'
import Password from '../(components)/password'
import Submit from '../(components)/submit'

export default function Page() {
  function onFormSubmit() {}

  return (
    <Background>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col max-w-[300px] mx-auto"
      >
        <Email />
        <Password confirm={false} />
        <Submit isLogin />
      </form>
    </Background>
  )
}
