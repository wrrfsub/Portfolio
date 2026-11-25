'use client'
import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ to, done = 'time is up' }) {
  const [left, setLeft] = useState(null)

  useEffect(() => {
    const end = new Date(to).getTime()
    const tick = () => setLeft(Math.max(0, end - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [to])

  if (left === 0) return <span>{done}</span>
  if (left === null) return <span>--d --h --m --s</span>

  const s = Math.floor(left / 1000)
  return (
    <span>
      {Math.floor(s / 86400)}d {pad(Math.floor(s / 3600) % 24)}h {pad(Math.floor(s / 60) % 60)}m {pad(s % 60)}s
    </span>
  )
}
