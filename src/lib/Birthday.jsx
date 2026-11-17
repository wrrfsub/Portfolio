'use client'
import { useEffect, useRef, useState } from 'react'
import s from './Birthday.module.css'

const COLORS = ['#ffb3d9', '#c9b6ff', '#ffdcc7', '#9fd4ff', '#b8f0d0']

const ROWS = ["IT'S MY", 'BIRTHDAY']
const STARS = [
  { c: 'pink', x: '6%', y: '58%', s: 46, d: 0.4 },
  { c: 'blue', x: '14%', y: '12%', s: 40, d: 1.1 },
  { c: 'pink', x: '83%', y: '18%', s: 38, d: 0.8 },
  { c: 'silver', x: '91%', y: '62%', s: 44, d: 1.6 },
]

let uid = 0
const spawn = (spread = false) => ({
  id: uid++,
  left: 4 + Math.random() * 90,
  size: 34 + Math.random() * 22,
  dur: 14 + Math.random() * 10,
  delay: spread ? -Math.random() * 20 : Math.random() * 3,
  sway: 2.5 + Math.random() * 2,
  c: COLORS[Math.floor(Math.random() * COLORS.length)],
})

const HZ = { F2: 87.31, G2: 98, A2: 110, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196, A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392 }
const MELODY = [
  ['G3', 0.75], ['G3', 0.25], ['A3', 1], ['G3', 1], ['C4', 1], ['B3', 2],
  ['G3', 0.75], ['G3', 0.25], ['A3', 1], ['G3', 1], ['D4', 1], ['C4', 2],
  ['G3', 0.75], ['G3', 0.25], ['G4', 1], ['E4', 1], ['C4', 1], ['B3', 1], ['A3', 2],
  ['F4', 0.75], ['F4', 0.25], ['E4', 1], ['C4', 1], ['D4', 1], ['C4', 3],
]
const CHORD = { C3: ['C3', 'E3', 'G3'], G2: ['G2', 'B2', 'D3'], F2: ['F2', 'A2', 'C3'] }
const BASS = [[1, 'C3', 3], [4, 'G2', 3], [7, 'G2', 3], [10, 'C3', 3], [13, 'C3', 3], [16, 'F2', 3], [19, 'C3', 3], [22, 'G2', 1], [23, 'C3', 3]]
const BEAT = 0.75
const SONG = 26 * BEAT
const GAP = 3

export default function Birthday() {
  const [popped, setPopped] = useState(0)
  const [sound, setSound] = useState(false)
  const [balloons, setBalloons] = useState([])
  const [bursts, setBursts] = useState([])
  const A = useRef({ ctx: null, out: null, timer: 0 }).current

  const first = () => A.ctx?.state === 'suspended' && A.ctx.resume()

  function pop(i, e) {
    const b = balloons[i]
    const r = e.currentTarget.querySelector(`.${s.body}`).getBoundingClientRect()
    const id = uid++
    setBursts((bs) => [...bs, { id, x: r.left + r.width / 2, y: r.top + r.height / 2, c: b.c }])
    setTimeout(() => setBursts((bs) => bs.filter((p) => p.id !== id)), 700)
    setBalloons((bs) => bs.map((x, j) => (j === i ? spawn() : x)))
    setPopped((n) => n + 1)
    first()
    popSound()
  }

  function popSound() {
    const ctx = A.ctx
    if (!ctx || ctx.state !== 'running') return
    const len = 0.09
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3
    const src = ctx.createBufferSource()
    src.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1400
    const g = ctx.createGain()
    g.gain.value = 0.35
    src.connect(bp).connect(g).connect(ctx.destination)
    src.start()
  }

  function voice(freq, at, len, vol, type, attack = 0.05, release = 0.45) {
    const o = A.ctx.createOscillator()
    const g = A.ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0, at)
    g.gain.linearRampToValueAtTime(vol, at + attack)
    g.gain.setTargetAtTime(vol * 0.65, at + attack, 0.5)
    g.gain.setTargetAtTime(0, at + Math.max(len, attack), release)
    o.connect(g).connect(A.out)
    o.start(at)
    o.stop(at + len + release * 6)
  }

  function playOnce() {
    let t = A.ctx.currentTime + 0.15
    const t0 = t
    for (const [n, beats] of MELODY) {
      voice(HZ[n], t, beats * BEAT, 0.45, 'triangle')
      voice(HZ[n] * 2, t, beats * BEAT, 0.05, 'sine')
      t += beats * BEAT
    }
    for (const [beat, n, beats] of BASS) {
      const at = t0 + beat * BEAT, len = beats * BEAT
      voice(HZ[n], at, len, 0.26, 'sine', 0.08, 0.8)
      for (const c of CHORD[n]) voice(HZ[c] * 2, at, len, 0.07, 'sine', 0.35, 0.9)
    }
    A.timer = setTimeout(playOnce, (SONG + GAP) * 1000)
  }

  function start() {
    const ctx = (A.ctx = new AudioContext())
    A.out = ctx.createGain()
    A.out.gain.value = 0.09
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1100
    const delay = ctx.createDelay()
    delay.delayTime.value = 0.38
    const fb = ctx.createGain()
    fb.gain.value = 0.35
    const wet = ctx.createGain()
    wet.gain.value = 0.45
    A.out.connect(lp).connect(ctx.destination)
    lp.connect(delay).connect(fb).connect(delay)
    delay.connect(wet).connect(ctx.destination)
    setSound(true)
    if (ctx.state === 'running') playOnce()
    else ctx.onstatechange = () => A.ctx?.state === 'running' && !A.timer && playOnce()
  }

  function stop() {
    clearTimeout(A.timer)
    A.timer = 0
    A.ctx?.close()
    A.ctx = null
    setSound(false)
  }

  const toggle = () => (sound ? stop() : start())

  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setBalloons(Array.from({ length: 7 }, () => spawn(true)))
    start()
    addEventListener('pointerdown', first, { once: true })
    addEventListener('keydown', first, { once: true })
    return () => {
      removeEventListener('pointerdown', first)
      removeEventListener('keydown', first)
      stop()
    }
  }, [])

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap" rel="stylesheet" precedence="default" />

      <div className={s.banner} role="img" aria-label="it's my birthday">
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="star-pink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd1ec" /><stop offset=".45" stopColor="#ff4fb5" /><stop offset="1" stopColor="#a0136a" /></linearGradient>
            <linearGradient id="star-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9dcff" /><stop offset=".45" stopColor="#2f6bff" /><stop offset="1" stopColor="#14307a" /></linearGradient>
            <linearGradient id="star-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#c9ccd6" /><stop offset="1" stopColor="#7d818f" /></linearGradient>
          </defs>
        </svg>
        {STARS.map((st, k) => (
          <span key={k} className={`${s.hang} ${s.star}`} style={{ left: st.x, top: st.y, width: st.s, '--d': `${st.d}s` }}>
            <svg viewBox="0 0 24 24"><path d="M12 2.5l2.8 6.1 6.7.7-5 4.6 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.6 6.7-.7z" fill={`url(#star-${st.c})`} stroke="rgb(255 255 255 / .35)" strokeWidth=".6" strokeLinejoin="round" /></svg>
          </span>
        ))}
        {ROWS.map((row, r) => (
          <div key={r} className={s.letters}>
            {[...row].map((ch, i) =>
              ch === ' ' ? <span key={i} className={s.gap} /> : <span key={i} className={`${s.hang} ${s.foil}`} style={{ '--d': `${(r * 8 + i) * 0.23}s` }}>{ch}</span>
            )}
          </div>
        ))}
      </div>

      <div className={s.sky} aria-hidden="true">
        {balloons.map((b, i) => (
          <button
            key={b.id}
            className={s.balloon}
            tabIndex={-1}
            style={{ left: `${b.left}%`, '--s': `${b.size}px`, '--c': b.c, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
            onPointerDown={(e) => pop(i, e)}
          >
            <span className={s.sway} style={{ animationDuration: `${b.sway}s` }}>
              <span className={s.body} />
              <svg className={s.string} viewBox="0 0 10 60" preserveAspectRatio="none"><path d="M5 0c-4 10 4 18 0 30s4 20 0 30" /></svg>
            </span>
          </button>
        ))}
        {bursts.map((p) => (
          <span key={p.id} className={s.burst} style={{ left: p.x, top: p.y, '--c': p.c }}>
            {Array.from({ length: 10 }, (_, k) => <i key={k} style={{ '--a': `${k * 36 + 10}deg` }} />)}
          </span>
        ))}
      </div>

      <div className={s.pill}>
        <span className={s.mini} />
        <span className="tabular-nums">{popped} popped</span>
        <span className="muted">·</span>
        <button onClick={toggle} className="muted transition-colors hover:text-white">
          {sound ? '♪ sound on' : 'sound off'}
        </button>
      </div>
    </>
  )
}
