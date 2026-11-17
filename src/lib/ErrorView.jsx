'use client'
import { useEffect, useState } from 'react'
import s from './ErrorView.module.css'

const strip = [...Array(20).keys()].map((n) => n % 10)

export default function ErrorView({ status }) {
  const lost = status === 404
  const digits = String(status).split('').map(Number)
  const [rolled, setRolled] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setRolled(true))
  }, [])

  function reroll() {
    setRolled(false)
    setTimeout(() => setRolled(true), 60)
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-[600px] flex-col justify-center px-5 py-20 text-base leading-7">
      <h1 className={`${s.odo} ${rolled ? s.rolled : ''}`} onMouseEnter={reroll} aria-label={String(status)}>
        {digits.map((d, i) => (
          <span key={i} className={s.col} aria-hidden="true">
            <span className={s.strip} style={{ '--to': 10 + d, '--i': i }}>
              {strip.map((n, k) => <span key={k}>{n}</span>)}
            </span>
          </span>
        ))}
      </h1>

      <div className={s.after}>
        <p className="mt-6 text-lg font-medium">{lost ? "this page doesn't exist" : 'something broke'}</p>
        <p className="muted mt-1">
          {lost ? 'either you typo’d it or i deleted it. probably the second one.' : 'probably my fault. try again in a bit.'}
        </p>
        <a href="/" className={`${s.home} mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 transition-colors hover:border-white/25 hover:bg-white/[0.04]`}>
          <span className={s.arrow}>←</span> back home
        </a>
      </div>
    </main>
  )
}
