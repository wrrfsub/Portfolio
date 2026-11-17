'use client'
import { useEffect, useRef, useState } from 'react'
import { applyTheme } from '@/lib/theme'

const hex = (rgb) => '#' + rgb.split(' ').map((n) => (+n).toString(16).padStart(2, '0')).join('')

const THEMES = [
  { id: 'dark', bg: '10 10 10', fg: '237 237 237', card: '17 17 17', pink: '#ffd4f4', orange: '#ffdcc7', blue: '#417dff' },
  { id: 'ocean', bg: '11 23 34', fg: '220 232 241', card: '17 33 47', pink: '#a9d6ec', orange: '#e8766d', blue: '#4fb3e0' },
  { id: 'light', bg: '250 250 249', fg: '24 24 27', card: '255 255 255', pink: '#c0267d', orange: '#c2410c', blue: '#2f6bff' },
  { id: 'mocha', bg: '25 21 18', fg: '236 226 212', card: '36 30 26', pink: '#d9b38c', orange: '#e08e6d', blue: '#e6b45c' },
  { id: 'birthday', bg: '21 11 19', fg: '251 233 241', card: '33 18 30', pink: '#c9b6ff', orange: '#ffdcc7', blue: '#ffb3d9', note: 'only on 12 dec, or add ?bday to the url' },
]
const EXTRAS = [
  { name: 'agent cursor 1', c: '#417dff' },
  { name: 'agent cursor 2', c: '#ff41d0' },
  { name: 'agent cursor 3', c: '#ff7328' },
  { name: 'resume link', c: '#ef4444' },
]

function Swatch({ name, c, onCopy }) {
  return (
    <button onClick={() => onCopy(c)} className="group flex min-w-0 flex-col items-center gap-1.5" title={`copy ${c}`}>
      <span className="h-9 w-9 rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-active:scale-90" style={{ background: c, boxShadow: '0 0 0 1px rgb(var(--fg) / 0.15)' }} />
      <span className="muted text-[11px] leading-3">{name}</span>
      <span className="font-mono text-[11px] leading-3 opacity-70">{c}</span>
    </button>
  )
}

export default function Palettes() {
  const [current, setCurrent] = useState('dark')
  const [copied, setCopied] = useState('')
  const timer = useRef(0)

  useEffect(() => {
    setCurrent(document.documentElement.dataset.theme || 'dark')
  }, [])

  async function copy(c) {
    try {
      await navigator.clipboard.writeText(c)
      setCopied(c)
    } catch {
      setCopied('')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(''), 1500)
  }

  function tryTheme(id) {
    applyTheme(id)
    setCurrent(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="muted -mt-3 h-5 text-[13px]">{copied ? <>copied <span className="font-mono" style={{ color: copied }}>{copied}</span></> : 'click a color to copy it, or try a theme on the whole site.'}</p>
      {THEMES.map((t) => (
        <div key={t.id} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium">{t.id}</span>
            {t.note ? (
              <span className="muted text-[13px]">{t.note}</span>
            ) : current === t.id ? (
              <span className="muted text-[13px]">you're on it</span>
            ) : (
              <button onClick={() => tryTheme(t.id)} className="link text-[13px]">try it</button>
            )}
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[['bg', hex(t.bg)], ['text', hex(t.fg)], ['card', hex(t.card)], ['pink', t.pink], ['orange', t.orange], ['blue', t.blue]].map(([name, c]) => (
              <Swatch key={name} name={name} c={c} onCopy={copy} />
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-3">
        <span className="font-medium">extras</span>
        <div className="grid grid-cols-6 gap-2">
          {EXTRAS.map((e) => <Swatch key={e.name} name={e.name} c={e.c} onCopy={copy} />)}
        </div>
      </div>
    </div>
  )
}
