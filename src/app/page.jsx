'use client'
import { useEffect, useRef, useState } from 'react'
import Birthday from '@/lib/Birthday'
import Guide from '@/lib/Guide'
import { GITHUB_AVATAR } from '@/lib/profile'
import { applyTheme } from '@/lib/theme'

const npt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kathmandu' })

const NPT_MS = 345 * 60000

function confetti(x, y, n = 90) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const c = document.createElement('canvas')
  Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '60' })
  document.body.append(c)
  const W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2)
  c.width = W * dpr
  c.height = H * dpr
  const g = c.getContext('2d')
  g.scale(dpr, dpr)
  const colors = ['#417dff', '#ffb3d9', '#ffdcc7', '#ffb02e', '#ededed']
  const bits = Array.from({ length: n }, (_, i) => {
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 9
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
      w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: colors[i % colors.length] }
  })
  const LIFE = 170
  let t = 0
  const frame = () => {
    g.clearRect(0, 0, W, H)
    g.globalAlpha = Math.max(0, 1 - t / LIFE)
    for (const b of bits) {
      b.vy += 0.28
      b.vx *= 0.985
      b.vy *= 0.985
      b.x += b.vx
      b.y += b.vy
      b.r += b.vr
      g.save()
      g.translate(b.x, b.y)
      g.rotate(b.r)
      g.fillStyle = b.c
      g.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.r * 2)))
      g.restore()
    }
    ++t < LIFE ? requestAnimationFrame(frame) : c.remove()
  }
  requestAnimationFrame(frame)
}

function cakeClick(e) {
  const r = e.currentTarget.getBoundingClientRect()
  confetti(r.left + r.width / 2, r.top + r.height / 2)
}

const host = (u) => (u ? new URL(u).hostname.replace(/^www\./, '') : '')

const THEMES = [
  { id: 'dark', bg: '#0a0a0a', fg: '#ededed' },
  { id: 'ocean', bg: '#0b1722', fg: '#4fb3e0' },
  { id: 'light', bg: '#fafaf9', fg: '#18181b' },
  { id: 'mocha', bg: '#191512', fg: '#e6b45c' },
]

const TOUR = [
  { sel: '[data-guide="intro"]', text: "hey, mini me here! that's the real me up top. self taught dev from nepal, living in the hosting world." },
  { sel: '[data-guide="serveros"]', text: "this is where i work rn. hover it to see what it is. oh and it's open source." },
  { sel: '[data-guide="studio"]', text: 'my little freelance studio. need something built? come say hi in the discord.' },
  { sel: '[data-guide="socials"]', text: 'wanna talk? github, discord, email, all right here. resume too.' },
  { sel: '[data-guide="exp"]', text: 'everywhere i\'ve worked. click any row to see what i actually did there.' },
  { sel: '[data-guide="bday"]', text: "it's my birthday today! pop the balloons and click the cake for confetti 🎉" },
  { sel: '[data-guide="themes"]', text: "not a dark mode fan? pick a theme up here. that's the tour, have fun poking around!" },
]

const jobs = [
  {
    role: 'jr. swe & support',
    company: 'serveros',
    url: 'https://serveros.com/',
    logo: '/img/serveros.png',
    about: 'linux server management in one panel: connect the vps you already rent, deploy from git, monitor everything and run backups, with an ai that proposes fixes when something breaks.',
    period: '08/2026 – present',
    points: [
      'build and maintain features for the server management panel, across the interface and the systems behind it.',
      'hands-on support: troubleshooting, walking users through setup, resolving technical queries.',
      'work with the engineering team on platform features, feeding recurring user problems back into what gets prioritised and fixed.',
    ],
  },
  {
    role: 'Admin & support',
    company: 'DiscordJobList',
    url: 'https://discordjoblist.com/',
    logo: '/img/DiscordJobList.png',
    about: 'job board built around discord communities: staff, dev, moderation and support roles posted inside discord servers, all in one place.',
    period: '08/2026 – present',
    points: [
      'help to resolve issues reported on the website, working each one through to a fix.',
      'hands-on support: helping users directly, answering questions, and resolving day-to-day problems.',
      'work on improving the site and finding bugs, feeding issues back into what gets fixed.',
    ],
  },
  {
    role: 'founder & freelance developer',
    company: 'subwaystudios',
    url: 'https://discord.gg/wmctpwXXUD',
    logo: '/img/subwaystudios.png',
    about: 'my small freelance studio: custom builds for clients, from first brief to after launch support. come say hi in the discord.',
    period: '02/2024 – present',
    points: [
      'founded and run a small freelance studio delivering custom development work for clients.',
      'handle projects independently from first brief through build, delivery, and after-launch support.',
      'single point of contact for clients throughout.',
    ],
  },
  {
    role: 'admin & support',
    company: 'mcsets',
    logo: '/img/mcsets.webp',
    about: 'store builder for minecraft servers: you open shop, they handle the rest, you chill.',
    period: '12/2025 – 06/2026',
    points: [
      'guided users through store setup, resolving configuration problems and questions along the way.',
      'managed user accounts and day-to-day admin tasks across the platform.',
      'identified friction in existing processes and proposed workflow improvements to cut repeat support requests.',
    ],
  },
  {
    role: 'developer',
    company: 'skyraincloud',
    url: 'https://www.skyraincloud.in/',
    logo: '/img/skyraincloud.webp',
    about: 'indian hosting provider: minecraft and game hosting, vps, dedicated servers and web hosting from tier-3 data centers.',
    period: '12/2024 – 05/2026',
    points: [
      'worked as a developer across the hosting platform, building and maintaining features around the game panel and client side.',
      'helped keep game servers, vps and web hosting running smoothly for customers.',
    ],
  },
  {
    role: 'support',
    company: 'servermint',
    url: 'https://servermint.app/',
    logo: '/img/servermint.png',
    about: 'desktop app for game server management: create, configure and deploy minecraft servers instantly.',
    period: '07/2025 – 09/2025',
    points: [
      'helped users get servermint set up from scratch, walking them through installation and first configuration.',
      'answered day-to-day support questions and turned recurring ones into clearer setup guidance.',
    ],
  },
]

export default function Home() {
  const [now, setNow] = useState('')
  const [bd, setBd] = useState(null)
  const [card, setCard] = useState(null)
  const [cardOn, setCardOn] = useState(false)
  const [theme, setThemeState] = useState('dark')
  const [open, setOpen] = useState(null)
  const [denied, setDenied] = useState(false)
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('nudged')) return
      sessionStorage.setItem('nudged', '1')
    } catch {}
    const wait = 1800
    const show = setTimeout(() => setNudge(true), wait)
    const hide = setTimeout(() => setNudge(false), wait + 3200)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])
  const guide = useRef(null)
  const bdRef = useRef(null)
  bdRef.current = bd

  useEffect(() => {
    const tick = () => setNow(npt.format(new Date()).toLowerCase())
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const force = new URLSearchParams(location.search).has('bday')
    const tick = () => {
      const np = new Date(Date.now() + NPT_MS)
      const today = force || (np.getUTCMonth() === 11 && np.getUTCDate() === 12)
      setBd((b) => (today ? (b?.today ? b : { today: true, age: np.getUTCFullYear() - 2008 }) : null))
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const partied = useRef(false)
  useEffect(() => {
    if (!bd?.today || partied.current) return
    partied.current = true
    document.documentElement.classList.add('bday-theme')
    document.title = "it's my birthday · s4way"
    const wait = 400
    setTimeout(() => confetti(innerWidth / 2, innerHeight * 0.35, 180), wait)
  }, [bd?.today])

  useEffect(() => {
    setThemeState(document.documentElement.dataset.theme || 'dark')
  }, [])
  function setTheme(id) {
    setThemeState(id)
    applyTheme(id)
  }

  const peek = (job) => ({
    onPointerEnter: (e) => {
      if (e.pointerType !== 'mouse' || !job) return
      const r = e.currentTarget.getBoundingClientRect()
      setCard({ ...job, host: host(job.url), x: Math.min(Math.max(r.left, 16), innerWidth - 296), y: r.bottom + 8 })
      setCardOn(true)
    },
    onPointerLeave: () => setCardOn(false),
  })
  useEffect(() => {
    const hide = () => setCardOn(false)
    addEventListener('scroll', hide, { passive: true })
    return () => removeEventListener('scroll', hide)
  }, [])

  useEffect(() => {
    let typed = ''
    function shortcuts(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length === 1) {
        typed = (typed + e.key).slice(-10)
        if (typed.endsWith('rm -rf')) {
          setDenied(true)
          setTimeout(() => setDenied(false), 3000)
          return
        }
      }
      if (e.key === 'g') window.open('https://github.com/wrrfsub', '_blank')
      else if (e.key === 's') window.open('https://serveros.com/', '_blank')
      else if (e.key === 'd') window.open('https://discord.com/users/1338099754080665651', '_blank')
      else if (e.key === 'e') location.href = 'mailto:saktirimala@gmail.com'
    }
    function onVisibility() {
      document.title = document.hidden ? 'come back 👀' : bdRef.current?.today ? "it's my birthday · s4way" : 'shakti rimal (s4way)'
    }
    addEventListener('keydown', shortcuts)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      removeEventListener('keydown', shortcuts)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const toggle = (i) => setOpen((o) => (o === i ? null : i))

  return (
    <>
      {bd?.today && <Birthday />}
      <Guide ref={guide} steps={TOUR} />

      <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
        <header className="flex items-end justify-between">
          <h1 className="sr-only">shakti rimal (s4way), self taught developer from nepal</h1>
          <button className={`pfp-btn${nudge ? ' nudging' : ''}`} aria-label="start a quick tour" onClick={(e) => { setNudge(false); guide.current?.start(e.currentTarget) }}>
            <img src={GITHUB_AVATAR} alt="shakti rimal (s4way)" className="pfp h-[72px] w-[72px] rounded-full" />
            <span className="nudge" aria-hidden="true">
              <svg width="44" height="34" viewBox="0 0 44 34"><path d="M40 6C28 3 14 7 5 22" /><path d="M5 22l1.5-8M5 22l8-3" /></svg>
              <span>psst, click me 👀</span>
            </span>
          </button>
          <div className="flex flex-col items-end gap-2.5">
            <div className="flex gap-1.5" role="radiogroup" aria-label="theme" data-guide="themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`swatch${theme === t.id ? ' on' : ''}`}
                  style={{ '--sw-bg': t.bg, '--sw-fg': t.fg }}
                  role="radio"
                  aria-checked={theme === t.id}
                  aria-label={`${t.id} theme`}
                  title={t.id}
                  onClick={() => setTheme(t.id)}
                />
              ))}
            </div>
            <p className="roll muted text-[13px] tabular-nums">
              <span>{bd?.today ? "it's my birthday" : 'updated november 2026'}</span>
              <span aria-hidden="true">{now || '--:--'} in nepal</span>
            </p>
          </div>
        </header>

        {bd?.today && <h2 className="bday-title">it's my birthday today, i'm turning {bd.age}</h2>}
        <p data-guide="intro">i'm shakti (s4way), a self taught <span className="quip" data-quip="i'm bad with design xd" tabIndex={0}>developer</span> from chitwan, nepal 🇳🇵, working in the hosting industry. oh and i use <span className="quip" data-quip="ok it's cachyos, but that's arch based so it counts" tabIndex={0}>arch</span> btw.</p>
        <p>
          i'm currently a jr. swe at <span className="relative" data-guide="serveros"><a className="link" style={{ color: 'var(--blue)' }} {...peek(jobs[0])} href="https://serveros.com/" target="_blank" rel="noreferrer">serveros</a><a className="oss" href="https://github.com/serveroshq/panel" target="_blank" rel="noreferrer"><svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true"><path d="M37 6C25 4 12 9 5 26" /><path d="M5 26l-.5-8M5 26l7-4" /></svg><span>it's open source!</span></a></span><a className="muted text-[13px] hover:text-white sm:hidden" href="https://github.com/serveroshq/panel" target="_blank" rel="noreferrer"> (open source)</a>, a linux server management panel,
          and admin at <a className="link" style={{ color: 'var(--orange)' }} {...peek(jobs[1])} href="https://discordjoblist.com/" target="_blank" rel="noreferrer">discordjoblist</a>,
          shipping features and helping users fix whatever broke.
        </p>
        <p>i also run <a className="link" data-guide="studio" {...peek(jobs[2])} href="https://discord.gg/wmctpwXXUD" target="_blank" rel="noreferrer">subwaystudios</a>, a small freelance studio where i take client projects from first brief to after launch support. stuff i sell lives on <a className="link" style={{ color: 'var(--pink)' }} href="https://builtbybit.com/creators/s4way.652483/" target="_blank" rel="noreferrer">builtbybit</a>.</p>
        <p data-guide="socials">
          find me on <a className="link" href="https://github.com/wrrfsub" target="_blank" rel="noreferrer">github</a>,{' '}
          <a className="link" href="https://discord.com/users/1338099754080665651" target="_blank" rel="noreferrer">discord</a>,{' '}
          <a className="link" href="https://x.com/nyxx_s7" target="_blank" rel="noreferrer">x</a>
          {' '}or email me at <a className="link" href="mailto:saktirimala@gmail.com">saktirimala@gmail.com</a>.
          here's my <a className="link text-red-500" href="/tools/Shakti_Rimal_Resume.pdf?v=2" target="_blank">resume</a>,
          my <a className="link" href="/goals/">goals for 2027</a>, and sometimes i <a className="link" href="/blog/">write stuff</a> or make <a className="link" href="/tools/">tools</a>.
          this site is <a className="link" href="https://github.com/wrrfsub/Portfolio" target="_blank" rel="noreferrer">open source</a> and here's <a className="link" href="/info/">how it's made</a>, steal whatever you like.
        </p>

        <section data-guide="exp">
          <h2 className="muted mb-3">experience</h2>
          <ul className="space-y-2">
            {jobs.map((job, i) => (
              <li key={job.company}>
                <div className="row flex cursor-pointer items-baseline gap-4" onClick={(e) => !e.target.closest('a') && toggle(i)}>
                  <span className="muted w-16 shrink-0 font-mono text-[13px]">{job.period.includes('present') ? 'current' : job.period.slice(-4)}</span>
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noreferrer" className="link capitalize" {...peek(job)}>{job.company}</a>
                  ) : (
                    <span className="capitalize" {...peek(job)}>{job.company}</span>
                  )}
                  <button className="muted ml-auto flex min-w-0 items-center gap-1.5 text-right" aria-expanded={open === i}>
                    <span className="truncate">{job.role.toLowerCase()}</span>
                    <svg className={`chev h-3.5 w-3.5 shrink-0${open === i ? ' up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </div>
                <div
                  className="grid transition-[grid-template-rows] duration-[280ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
                  style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
                  inert={open !== i}
                >
                  <div className="overflow-hidden">
                    <div className="pb-2 pl-20 pt-2">
                      <p className="muted font-mono text-[13px]">{job.period}</p>
                      <ul className="mt-2 space-y-1.5">
                        {job.points.map((point) => (
                          <li key={point} className="relative pl-4 text-[15px] leading-6 text-white/80 before:absolute before:left-0 before:top-[11px] before:h-1 before:w-1 before:rounded-full before:bg-white/30 first-letter:uppercase">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {bd?.today && (
          <section data-guide="bday" className="bday party mt-6 flex flex-col items-center text-center">
            <svg className="sticker" onClick={cakeClick} width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
              <g stroke="#fff" strokeWidth="5" strokeLinejoin="round" fill="#fff">
                <rect x="10" y="30" width="44" height="22" rx="5" />
                <rect x="16" y="20" width="32" height="14" rx="4" />
                <rect x="29.5" y="9" width="5" height="12" rx="2" />
                <rect x="6" y="50" width="52" height="7" rx="3.5" />
              </g>
              <rect x="6" y="50" width="52" height="7" rx="3.5" fill="#d9d9e3" />
              <rect x="10" y="30" width="44" height="22" rx="5" fill="#ffb3d9" />
              <path d="M10 37c4 4 7 4 11 0s7-4 11 0 7 4 11 0 7-4 11 0v-2H10z" fill="#fff" />
              <rect x="16" y="20" width="32" height="14" rx="4" fill="#ffdcc7" />
              <path d="M16 25c3 3 5 3 8 0s5-3 8 0 5 3 8 0 5-3 8 0v-2H16z" fill="#fff" />
              <rect x="29.5" y="11" width="5" height="10" rx="2" fill="#7fa6ff" />
              <path d="M32 3c3 3 3 6 0 7.5-3-1.5-3-4.5 0-7.5z" fill="#ffb02e" />
            </svg>
            <p className="mt-4 text-lg font-medium">it's my birthday, i'm {bd.age} today</p>
            <p className="muted text-[13px]">pop a balloon or two</p>
          </section>
        )}

        <div className={`peek${cardOn ? ' on' : ''}`} style={{ left: card?.x ?? 0, top: card?.y ?? 0 }} aria-hidden="true">
          {card && (
            <>
              <div className="flex items-center gap-2.5">
                <img src={card.logo} alt="" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium capitalize leading-5">{card.company}</p>
                  {card.host && <p className="muted truncate font-mono text-[11px] leading-4">{card.host}</p>}
                </div>
              </div>
              <p className="muted mt-2 text-[13px] leading-5 first-letter:uppercase">{card.about}</p>
            </>
          )}
        </div>

        {denied && (
          <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/40 bg-[rgb(var(--card))] px-4 py-2 font-mono text-[13px] text-red-500">
            rm: cannot remove '/': permission denied. nice try.
          </div>
        )}
      </main>
    </>
  )
}
