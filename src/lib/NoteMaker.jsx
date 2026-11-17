'use client'
import { useEffect, useState } from 'react'

const ARROWS = [
  { id: 'down-left', label: 'arrow down left' },
  { id: 'down-right', label: 'arrow down right' },
  { id: 'up-right', label: 'arrow up right' },
  { id: 'up-left', label: 'arrow up left' },
  { id: 'none', label: 'no arrow' },
]
const COLORS = ['#417dff', '#4fb3e0', '#ffb3d9', '#ffdcc7', '#e6b45c', '#ededed', '#18181b']
const SHAFT = 'M37 6C25 4 12 9 5 26'
const HEAD = 'M5 26l-.5-8M5 26l7-4'

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function build({ text, size, arrow, color, rotate, stroke, bg, animate, tw, fontCss }) {
  const s = size / 22
  const has = arrow !== 'none'
  const left = arrow.endsWith('left')
  const up = arrow.startsWith('up')
  const aw = 40 * s, ah = 30 * s, gap = 2 * s
  const th = size * 1.05
  const W = has ? aw + gap + tw : tw
  const H = has ? Math.max(ah + 4 * s, th) : th

  let textTop = 0
  let arrowY = 4 * s
  if (up) {
    textTop = H - th
    arrowY = H - 4 * s - ah
  }
  const textX = has && left ? aw + gap : 0
  const arrowX = left ? 0 : tw + gap
  const baseline = textTop + size * 0.8

  const r = (rotate * Math.PI) / 180
  const pad = 6 + stroke * s
  const RW = Math.abs(W * Math.cos(r)) + Math.abs(H * Math.sin(r)) + pad * 2
  const RH = Math.abs(W * Math.sin(r)) + Math.abs(H * Math.cos(r)) + pad * 2
  const w = Math.ceil(RW), h = Math.ceil(RH)

  const flip = `translate(${left ? 0 : 40} ${up ? 30 : 0}) scale(${left ? 1 : -1} ${up ? -1 : 1})`
  const draw = (len, begin, dur) =>
    animate ? ` stroke-dasharray="${len}" stroke-dashoffset="${len}"><animate attributeName="stroke-dashoffset" from="${len}" to="0" begin="${begin}s" dur="${dur}s" fill="freeze"/></path>` : '/>'
  const arrowSvg = has
    ? `<g transform="translate(${arrowX} ${arrowY}) scale(${s}) ${flip}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"><path d="${SHAFT}"${draw(70, 0.1, 0.8)}<path d="${HEAD}"${draw(20, 0.85, 0.25)}</g>`
    : ''
  const textStart = has ? 1 : 0.1
  const clip = animate
    ? `<clipPath id="reveal"><rect x="${textX - size}" y="${textTop - size}" height="${th + size * 2}" width="0"><animate attributeName="width" from="0" to="${tw + size * 2}" begin="${textStart}s" dur="0.7s" fill="freeze"/></rect></clipPath>`
    : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${
    fontCss ? `<style>${fontCss}</style>` : ''
  }${clip}${bg !== 'none' ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}<g transform="translate(${RW / 2} ${RH / 2}) rotate(${rotate}) translate(${-W / 2} ${-H / 2})">${arrowSvg}<text x="${textX}" y="${baseline}" font-family="Caveat, cursive" font-weight="600" font-size="${size}" fill="${color}"${
    animate ? ' clip-path="url(#reveal)"' : ''
  }>${esc(text)}</text></g></svg>`
  return { svg, w, h }
}

async function embedFont(text) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Caveat:wght@600&text=${encodeURIComponent(text)}`)).text()
  const url = css.match(/url\((https:[^)]+)\)/)?.[1]
  if (!url) return ''
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer())
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `@font-face{font-family:'Caveat';font-weight:600;src:url(data:font/woff2;base64,${btoa(bin)}) format('woff2')}`
}

function download(blob, name) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function Range({ label, value, min, max, step, onChange, unit = '' }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="muted flex justify-between text-[13px]">
        {label}
        <span className="tabular-nums">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="accent-[var(--blue)]" />
    </label>
  )
}

export default function NoteMaker() {
  const [text, setText] = useState("it's open source!")
  const [arrow, setArrow] = useState('down-left')
  const [color, setColor] = useState('#417dff')
  const [size, setSize] = useState(48)
  const [rotate, setRotate] = useState(-3)
  const [stroke, setStroke] = useState(1.6)
  const [bg, setBg] = useState('none')
  const [animate, setAnimate] = useState(true)
  const [scale, setScale] = useState(2)
  const [tw, setTw] = useState(0)
  const [replay, setReplay] = useState(0)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let off = false
    document.fonts.load(`600 ${size}px Caveat`, text || 'a').then(() => {
      if (off) return
      const c = document.createElement('canvas').getContext('2d')
      c.font = `600 ${size}px Caveat, cursive`
      setTw(c.measureText(text).width)
    })
    return () => {
      off = true
    }
  }, [text, size])

  const opts = { text, size, arrow, color, rotate, stroke, bg, tw }
  const preview = build({ ...opts, animate })

  const flash = (m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 1800)
  }

  async function svgWithFont(anim) {
    let fontCss = ''
    try {
      fontCss = await embedFont(text)
    } catch {
      flash("couldn't embed the font, file will use the viewer's fonts")
    }
    return build({ ...opts, animate: anim, fontCss })
  }

  async function exportSvg() {
    setBusy('svg')
    const { svg } = await svgWithFont(animate)
    download(new Blob([svg], { type: 'image/svg+xml' }), 'note.svg')
    setBusy('')
  }

  async function exportRaster(type) {
    setBusy(type)
    const { svg, w, h } = await svgWithFont(false)
    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    await img.decode()
    const c = document.createElement('canvas')
    c.width = w * scale
    c.height = h * scale
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    c.toBlob((b) => {
      download(b, `note.${type}`)
      setBusy('')
    }, `image/${type}`, 0.95)
  }

  async function copySvg() {
    const { svg } = await svgWithFont(animate)
    try {
      await navigator.clipboard.writeText(svg)
      flash('svg copied')
    } catch {
      flash("couldn't copy, use the download instead")
    }
  }

  const btn = 'rounded-full border border-white/10 px-4 py-1.5 text-[14px] transition-colors hover:border-white/25 hover:bg-white/[0.04] disabled:opacity-50'

  return (
    <>
      <section
        className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 p-6"
        style={
          bg === 'none'
            ? { background: 'repeating-conic-gradient(rgb(var(--fg) / 0.05) 0 25%, transparent 0 50%) 0 0 / 20px 20px' }
            : { background: bg }
        }
      >
        <div key={replay} className="max-w-full [&>svg]:h-auto [&>svg]:max-w-full" dangerouslySetInnerHTML={{ __html: preview.svg }} />
        {animate && (
          <button onClick={() => setReplay((n) => n + 1)} className="muted absolute bottom-2 right-3 text-[12px] hover:text-white">
            replay ↻
          </button>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <label className="flex flex-col gap-1">
          <span className="muted text-[13px]">text</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={80}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none transition-colors focus:border-white/30"
          />
        </label>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1.5">
            <span className="muted text-[13px]">arrow</span>
            <div className="flex gap-1.5" role="radiogroup" aria-label="arrow">
              {ARROWS.map((a) => (
                <button
                  key={a.id}
                  role="radio"
                  aria-checked={arrow === a.id}
                  aria-label={a.label}
                  title={a.label}
                  onClick={() => setArrow(a.id)}
                  className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${arrow === a.id ? 'border-white/40 bg-white/[0.06]' : 'border-white/10 hover:border-white/25'}`}
                >
                  {a.id === 'none' ? (
                    <span className="muted text-[13px]">off</span>
                  ) : (
                    <svg width="20" height="16" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transform: `${a.id.endsWith('right') ? 'scaleX(-1)' : ''} ${a.id.startsWith('up') ? 'scaleY(-1)' : ''}` }}>
                      <path d={SHAFT} />
                      <path d={HEAD} />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="muted text-[13px]">color</span>
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  aria-label={`color ${c}`}
                  onClick={() => setColor(c)}
                  className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, boxShadow: color === c ? '0 0 0 2px rgb(var(--bg)), 0 0 0 3.5px rgb(var(--fg) / 0.7)' : '0 0 0 1px rgb(var(--fg) / 0.2)' }}
                />
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="custom color" className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Range label="size" value={size} min={18} max={140} step={1} onChange={setSize} unit="px" />
          <Range label="tilt" value={rotate} min={-25} max={25} step={1} onChange={setRotate} unit="°" />
          <Range label="arrow weight" value={stroke} min={0.8} max={4} step={0.1} onChange={setStroke} />
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[14px]">
          <div className="flex items-center gap-2">
            <span className="muted text-[13px]">background</span>
            <button onClick={() => setBg('none')} className={`rounded-full px-3 py-0.5 ${bg === 'none' ? 'bg-white/10' : 'muted hover:text-white'}`}>none</button>
            <button onClick={() => setBg(bg === 'none' ? '#0a0a0a' : bg)} className={`rounded-full px-3 py-0.5 ${bg !== 'none' ? 'bg-white/10' : 'muted hover:text-white'}`}>color</button>
            {bg !== 'none' && <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="background color" className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0" />}
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} className="accent-[var(--blue)]" />
            <span>draw animation <span className="muted">(svg only)</span></span>
          </label>
          <div className="flex items-center gap-2">
            <span className="muted text-[13px]">png/webp size</span>
            {[1, 2, 4].map((n) => (
              <button key={n} onClick={() => setScale(n)} className={`rounded-full px-2.5 py-0.5 tabular-nums ${scale === n ? 'bg-white/10' : 'muted hover:text-white'}`}>{n}x</button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className={btn} disabled={!!busy || !text} onClick={exportSvg}>{busy === 'svg' ? 'making…' : '↓ svg'}</button>
          <button className={btn} disabled={!!busy || !text} onClick={() => exportRaster('png')}>{busy === 'png' ? 'making…' : '↓ png'}</button>
          <button className={btn} disabled={!!busy || !text} onClick={() => exportRaster('webp')}>{busy === 'webp' ? 'making…' : '↓ webp'}</button>
          <button className={btn} disabled={!!busy || !text} onClick={copySvg}>copy svg</button>
          {msg && <span className="muted text-[13px]">{msg}</span>}
        </div>
        <p className="muted text-[13px]">
          {preview.w} × {preview.h}px · png/webp export at {preview.w * scale} × {preview.h * scale}px · the font gets embedded so it looks the same everywhere
        </p>
      </section>
    </>
  )
}
