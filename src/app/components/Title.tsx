import { PropsWithChildren } from 'react'

export function Title(props: PropsWithChildren) {
  return (
    <h1>
      {props.children}
    </h1>
  )
}