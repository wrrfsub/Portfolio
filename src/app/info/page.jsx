import Palettes from '@/lib/Palettes'
import { GITHUB_AVATAR } from '@/lib/profile'

export const metadata = {
  title: 'info · s4way',
  description: 'how s4-way.me is made: the colors, fonts, tech stack and the site that inspired it.',
  alternates: { canonical: '/info/' },
  openGraph: { url: '/info/', title: 'info · s4way' },
}

const STACK = [
  { name: 'next.js', v: '16.4.6', what: 'app router, exported as plain static html', url: 'https://nextjs.org/' },
  { name: 'react', v: '19.3.1', what: 'the interactive bits', url: 'https://react.dev/' },
  { name: 'tailwind css', v: '3.4.19', what: 'styling, plus hand written css for the animations', url: 'https://v3.tailwindcss.com/' },
  { name: 'marked + gray-matter', v: '18.2.1 · 4.0.3', what: 'blog posts are markdown files', url: 'https://marked.js.org/' },
  { name: 'vercel', v: null, what: 'hosting, deploys on every push', url: 'https://vercel.com/' },
  { name: 'umami', v: null, what: 'privacy friendly analytics, views and reads', url: 'https://umami.is/' },
]

const FONTS = [
  { name: 'Manrope', what: 'everything you read', cls: 'font-sans text-lg', sample: 'self taught developer from nepal' },
  { name: 'Geist Mono', what: 'dates and numbers', cls: 'font-mono text-[15px]', sample: '08/2026 · 4 min read' },
  { name: 'Caveat', what: 'the handwritten notes', cls: 'text-2xl', style: { fontFamily: 'Caveat, cursive', fontWeight: 600, color: 'var(--blue)' }, sample: "it's open source!" },
]

const h2 = 'muted mb-4'

export default function Info() {
  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
      <header className="flex items-center justify-between">
        <a href="/" className="group flex items-center gap-3" aria-label="home">
          <img src={GITHUB_AVATAR} alt="" className="pfp h-9 w-9 rounded-full" />
          <span className="muted transition-colors group-hover:text-white">← s4way</span>
        </a>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">info</h1>
        <p className="muted mt-1">how this site is made, in case you want to steal some of it.</p>
      </div>

      <section>
        <h2 className={h2}>colors</h2>
        <Palettes />
      </section>

      <section>
        <h2 className={h2}>fonts</h2>
        <ul className="flex flex-col gap-4">
          {FONTS.map((f) => (
            <li key={f.name} className="flex flex-col">
              <span className={f.cls} style={f.style}>{f.sample}</span>
              <span className="muted text-[13px]">{f.name} · {f.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={h2}>stack</h2>
        <ul className="space-y-2">
          {STACK.map((s) => (
            <li key={s.name} className="flex items-baseline gap-4">
              <a href={s.url} target="_blank" rel="noreferrer" className="link shrink-0">{s.name}</a>
              <span className="muted min-w-0 flex-1 truncate">{s.what}</span>
              {s.v && <span className="muted shrink-0 font-mono text-[13px]">{s.v}</span>}
            </li>
          ))}
        </ul>
        <p className="muted mt-4 text-[15px] leading-6">no ui or animation libraries. the agent cursors, mini me tour and page transitions are plain css and a little js. the birthday confetti is a tiny canvas script and the birthday song is web audio, no mp3.</p>
      </section>

      <section>
        <h2 className={h2}>inspo</h2>
        <p>the look and feel comes from <a href="https://madebyadi.cc/" target="_blank" rel="noreferrer" className="link" style={{ color: 'var(--pink)' }}>madebyadi.cc</a>, aditya's site. they're a product and brand designer and their site is really good, go look at it.</p>
      </section>

      <section>
        <h2 className={h2}>source</h2>
        <p>all of it is on <a href="https://github.com/wrrfsub/Portfolio" target="_blank" rel="noreferrer" className="link">github</a>. take what you like.</p>
      </section>
    </main>
  )
}
