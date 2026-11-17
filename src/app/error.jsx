'use client'
import ErrorView from '@/lib/ErrorView'

export default function Error() {
  return (
    <>
      <title>500 · s4way</title>
      <ErrorView status={500} />
    </>
  )
}
