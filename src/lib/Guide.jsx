'use client'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import s from './Guide.module.css'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const MINI = 40
const HOP = 720

export default function Guide({ steps, ref }) {
  const [active, setActive] = useState(false)
  const [i, setI] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dir, setDir] = useState('right')
  const [lean, setLean] = useState(0)
  const [landing, setLanding] = useState(false)
  const [talk, setTalk] = useState(false)
  const [typed, setTyped] = useState(0)
  const [bubble, setBubble] = useState({ x: 0, y: 0, w: 260, below: false, tail: 20 })
  const [spot, setSpot] = useState(null)

  const R = useRef({ active: false, x: 0, home: { x: 0, y: 0 }, typer: 0, typed: 0 }).current
  const text = steps[i]?.text ?? ''
  const typing = typed < text.length

  const setTypedBoth = (n) => {
    R.typed = n
    setTyped(n)
  }

  async function hop(nx, ny) {
    setLean(Math.sign(nx - R.x) || 0)
    setLanding(false)
    R.x = nx
    setPos({ x: nx, y: ny })
    await wait(HOP)
    setLean(0)
    setLanding(true)
  }

  function place(el) {
    const r = el.getBoundingClientRect()
    const dx = r.left + scrollX, dy = r.top + scrollY
    const inline = getComputedStyle(el).display.startsWith('inline')
    const px = inline ? 3 : 8, py = inline ? 1 : 8
    setSpot({ x: dx - px, y: dy - py, w: r.width + px * 2, h: r.height + py * 2, r: inline ? 6 : 12 })
    let nx, ny
    if (r.left >= MINI + 30 && !inline) {
      setDir('right')
      nx = dx - MINI - 20
      ny = dy + Math.min(r.height, 28) / 2 - MINI / 2
    } else {
      setDir('down')
      nx = dx + r.width / 2 - MINI / 2
      ny = dy - MINI - 18
    }
    hop(nx, ny)
    const w = Math.min(270, innerWidth - 24)
    const below = ny - scrollY < 150
    const bx = Math.max(12 + scrollX, Math.min(nx - 10, scrollX + innerWidth - w - 12))
    setBubble({ x: bx, y: below ? ny + MINI + 14 : ny - 14, w, below, tail: nx + MINI / 2 - bx })
  }

  function type(len) {
    clearInterval(R.typer)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setTypedBoth(len)
    setTypedBoth(0)
    R.typer = setInterval(() => {
      setTypedBoth(R.typed + 1)
      if (R.typed >= len) clearInterval(R.typer)
    }, 18)
  }

  async function go(n) {
    setTalk(false)
    clearInterval(R.typer)
    if (n >= steps.length) return end()
    const el = document.querySelector(steps[n].sel)
    if (!el) return go(n + 1)
    setI(n)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    await wait(420)
    if (!R.active) return
    place(el)
    await wait(HOP)
    if (!R.active) return
    setTalk(true)
    type(steps[n].text.length)
  }

  function next() {
    if (typing) {
      clearInterval(R.typer)
      setTypedBoth(text.length)
    } else go(i + 1)
  }

  async function start(from) {
    if (R.active) return
    const r = from.getBoundingClientRect()
    R.home = { x: r.left + scrollX + r.width / 2 - MINI / 2, y: r.top + scrollY + r.height / 2 - MINI / 2 }
    R.x = R.home.x
    setPos(R.home)
    setSpot({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height })
    R.active = true
    setActive(true)
    await wait(380)
    go(0)
  }

  async function end() {
    setTalk(false)
    clearInterval(R.typer)
    setSpot(null)
    hop(R.home.x, R.home.y)
    await wait(HOP)
    R.active = false
    setActive(false)
  }

  useImperativeHandle(ref, () => ({ start }))

  useEffect(() => {
    if (!active) return
    const keys = (e) => {
      if (e.key === 'Escape') end()
      else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' && i > 0) go(i - 1)
    }
    addEventListener('keydown', keys)
    return () => removeEventListener('keydown', keys)
  })

  if (!active) return null
  return (
    <>
      <div
        className={`${s.spot} ${spot ? '' : s.off}`}
        style={spot ? { transform: `translate(${spot.x}px, ${spot.y}px)`, width: spot.w, height: spot.h, borderRadius: spot.r ?? 12 } : undefined}
        aria-hidden="true"
      />

      <div className={s['mini-x']} style={{ transform: `translateX(${pos.x}px)` }}>
        <div className={s['mini-y']} style={{ transform: `translateY(${pos.y}px)` }}>
          <div className={s.bob}>
            <div className={`${s.body} ${landing ? s.land : ''}`} style={{ rotate: `${lean * 7}deg` }} onAnimationEnd={() => setLanding(false)}>
              <img src="/img/newpfp.jpg" alt="mini s4way" />
            </div>
            {talk && <span className={`${s.point} ${s[dir]}`} aria-hidden="true" />}
          </div>
        </div>
      </div>

      {talk && (
        <div
          className={`${s.bubble} ${bubble.below ? s.below : ''}`}
          style={{ left: bubble.x, top: bubble.y, width: bubble.w, '--tail': `${bubble.tail}px` }}
          role="dialog"
          aria-label="tour"
          onClick={(e) => !e.target.closest('button') && typing && next()}
        >
          <p aria-live="polite">{text.slice(0, typed)}<span className={s.ghost}>{text.slice(typed)}</span></p>
          <div className={s.foot}>
            <div className={s.dots} aria-hidden="true">
              {steps.map((_, k) => <span key={k} className={k === i ? s.now : k < i ? s.done : undefined} />)}
            </div>
            <div className="flex items-center gap-3">
              <button className="muted hover:text-white" onClick={end}>skip</button>
              {i > 0 && <button className="muted hover:text-white" onClick={() => go(i - 1)}>back</button>}
              <button className={s.next} onClick={next}>{i === steps.length - 1 ? 'done' : 'next'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
