'use client'
import { Fragment, useEffect, useReducer, useRef } from 'react'
import s from './AgentCursor.module.css'

const COLORS = ['#417dff', '#ff41d0', '#ff7328']
const MOVE = 300
const DRAG = 300

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

export default function AgentCursor() {
  const agents = useRef([])
  const [, render] = useReducer((n) => n + 1, 0)

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('building')) return
    let stop = false
    const W = innerWidth, H = innerHeight
    const starts = [[-30, H + 30], [W + 30, H + 30], [W + 30, H * 0.4]]
    agents.current = COLORS.map((color, i) => ({
      color,
      x: starts[i][0],
      y: starts[i][1],
      label: '',
      gone: false,
      box: { x: 0, y: 0, w: 0, h: 0, on: false },
    }))
    render()

    const blocks = [...document.querySelectorAll('[data-build]')]
    const queues = COLORS.map((_, i) => blocks.filter((_, j) => j % COLORS.length === i))

    const run = async (i) => {
      const a = agents.current[i]
      await wait(i * 110)
      for (const el of queues[i]) {
        if (stop) return
        const r = el.getBoundingClientRect()
        const pad = 4
        const L = r.left - pad, T = r.top - pad, R = r.right + pad, B = r.bottom + pad
        a.label = el.dataset.build
        a.x = L
        a.y = T
        render()
        await wait(MOVE)
        a.box = { x: L, y: T, w: 0, h: 0, on: false }
        render()
        await frame()
        a.box = { x: L, y: T, w: R - L, h: B - T, on: true }
        a.x = R
        a.y = B
        render()
        await wait(DRAG * 0.55)
        el.classList.add('built')
        el.animate(
          [
            { opacity: 0, filter: 'blur(8px)', transform: 'scale(0.985)' },
            { opacity: 1, filter: 'blur(0)', transform: 'none' },
          ],
          { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        )
        await wait(DRAG * 0.45 + 140)
        a.box.on = false
        render()
      }
      a.label = ''
      a.x += 30
      a.y += 24
      a.gone = true
      render()
    }

    Promise.all(COLORS.map((_, i) => run(i))).then(async () => {
      await wait(450)
      root.classList.replace('building', 'built-page')
      agents.current = []
      render()
      try { sessionStorage.setItem('built', '1') } catch {}
    })

    return () => {
      stop = true
      root.classList.remove('building')
    }
  }, [])

  return agents.current.map((a, i) => (
    <Fragment key={i}>
      <div
        className={`${s.box} ${a.box.on ? s.on : ''}`}
        style={{ transform: `translate(${a.box.x}px, ${a.box.y}px)`, width: a.box.w, height: a.box.h, '--c': a.color }}
        aria-hidden="true"
      />
      <div className={`${s.agent} ${a.gone ? s.gone : ''}`} style={{ transform: `translate(${a.x}px, ${a.y}px)` }} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill={a.color} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        {a.label && <span style={{ background: a.color }}>{a.label}</span>}
      </div>
    </Fragment>
  ))
}
