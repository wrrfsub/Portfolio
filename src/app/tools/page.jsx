import { GITHUB_AVATAR } from '@/lib/profile'

export const metadata = {
  title: 'tools · s4way',
  description: 'small free tools i made. they run in your browser, no sign up.',
  alternates: { canonical: '/tools/' },
  openGraph: { url: '/tools/', title: 'tools · s4way' },
}

const TOOLS = [
  { slug: 'note', name: 'note maker', about: 'handwritten arrow notes like the ones on my site. download as svg, png or webp.' },
]

export default function Tools() {
  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
      <header className="flex items-center justify-between">
        <a href="/" className="group flex items-center gap-3" aria-label="home">
          <img src={GITHUB_AVATAR} alt="" className="pfp h-9 w-9 rounded-full" />
          <span className="muted transition-colors group-hover:text-white">← s4way</span>
        </a>
        <p className="muted text-[13px] tabular-nums">{TOOLS.length} {TOOLS.length === 1 ? 'tool' : 'tools'}</p>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">tools</h1>
        <p className="muted mt-1">small free things i made. they run in your browser, no sign up.</p>
      </div>

      <ul className="-mx-3">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <a href={`/tools/${t.slug}/`} className="group flex items-baseline justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.04]">
              <span className="min-w-0">
                <span className="font-medium" style={{ viewTransitionName: `tool-${t.slug}` }}>{t.name}</span>
                <span className="muted mt-0.5 block text-[15px] leading-6">{t.about}</span>
              </span>
              <span className="muted shrink-0 -translate-x-1 text-[13px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">open →</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
