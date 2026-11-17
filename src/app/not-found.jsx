import ErrorView from '@/lib/ErrorView'

export const metadata = { title: '404 · s4way', robots: { index: false, follow: true } }

export default function NotFound() {
  return <ErrorView status={404} />
}
