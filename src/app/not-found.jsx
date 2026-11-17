import ErrorView from '@/lib/ErrorView'

export const metadata = { title: '404 · s4way' }

export default function NotFound() {
  return <ErrorView status={404} />
}
