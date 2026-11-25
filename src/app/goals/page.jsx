import Countdown from '@/lib/Countdown'

import { GITHUB_AVATAR } from '@/lib/profile'

export const metadata = {
  title: 'goals · s4way',
  description: 'what i want to get done in 2027, and how far along i am.',
  alternates: { canonical: '/goals/' },
  openGraph: { url: '/goals/', title: 'goals · s4way' },
}

const GOALS = [
  {
    title: 'build a decent setup',
    why: (
      <>
        my current setup is really{' '}
        <span className="bad" tabIndex={0}>
          bad
          <span className="badcard">
            <img src="/img/setup.webp" alt="my current setup, a laptop and a cheap rgb keyboard in a dark room" width="600" height="800" className="block aspect-[4/3] w-full rounded-lg object-cover object-[50%_20%]" />
            <span className="mt-2 block font-medium" style={{ color: 'rgb(var(--fg))' }}>acer nitro anv15-41</span>
            <span className="block">ryzen 5 7535hs</span>
            <span className="block">rtx 3050 laptop, 6gb</span>
            <span className="block">8gb ram. yes, eight. in 2026.</span>
            <span className="block">512gb ssd</span>
            <span className="block">15.6" 1080p, my only screen</span>
            <span className="block">and yeah, the middle of the screen is broken 😭</span>
          </span>
        </span>
        . i ship prod code on it every day and it fights me every step. time to fix that.
      </>
    ),
    saved: 200,
    target: 4000,
    stuff: [
      ['pc', "haven't thought about specs yet. might just go mac"],
      ['monitor', 'asus tuf vg27aq5a'],
      ['monitor arm', 'fantech promount mbs1'],
      ['keyboard', 'aula f75'],
      ['mouse', 'fantech tanto wg13 wireless'],
      ['iem', 'tangzu waner sg 2 red lion edition'],
      ['desk', 'still picking one'],
    ],
  },
]

const usd = (n) => `$${n.toLocaleString('en-US')}`

export default function Goals() {
  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
      <header className="flex items-center justify-between">
        <a href="/" className="group flex items-center gap-3" aria-label="home">
          <img src={GITHUB_AVATAR} alt="" className="pfp h-9 w-9 rounded-full" />
          <span className="muted transition-colors group-hover:text-white">← s4way</span>
        </a>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">goals for 2027</h1>
        <p className="muted mt-1">stuff i want to get done next year. putting it here so i can't pretend i never said it.</p>
      </div>

      <ul className="flex flex-col gap-8">
        {GOALS.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100))
          return (
            <li key={g.title}>
              <h2 className="font-medium">{g.title}</h2>
              <p className="muted relative mt-1">{g.why}</p>
              <div className="mt-4 flex items-baseline justify-between font-mono text-[13px] tabular-nums">
                <span><span style={{ color: 'var(--blue)' }}>{usd(g.saved)}</span> <span className="muted">saved</span></span>
                <span className="muted">{pct}% of {usd(g.target)}</span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full"
                style={{ background: 'rgb(var(--fg) / 0.08)' }}
                role="progressbar"
                aria-valuenow={g.saved}
                aria-valuemin={0}
                aria-valuemax={g.target}
                aria-label={`${g.title} progress`}
              >
                <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--blue)' }} />
              </div>
              <p className="muted mt-2 text-[13px]">{usd(g.target - g.saved)} to go. ramen era begins.</p>
              {g.stuff && (
                <>
                  <div className="mt-6 rounded-xl px-4 py-3" style={{ border: '1px solid rgb(var(--fg) / 0.1)' }}>
                    <p className="text-[15px]">i think i can get everything except the pc in the next 2 weeks. hold me to it.</p>
                    <p className="mt-1 font-mono text-[13px] tabular-nums" style={{ color: 'var(--blue)' }} aria-live="off">
                      <Countdown to="2026-12-09T23:59:59+05:45" done="time's up. did i do it?" />
                    </p>
                  </div>
                  <h3 className="muted mb-2 mt-6">the shopping list</h3>
                  <ul className="flex flex-col">
                    {g.stuff.map(([what, pick]) => (
                      <li key={what} className="flex gap-4 py-2" style={{ borderBottom: '1px solid rgb(var(--fg) / 0.07)' }}>
                        <span className="muted w-28 shrink-0">{what}</span>
                        <span>{pick}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="muted mt-3 text-[13px]">just ideas for now, some of this will probably change.</p>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
