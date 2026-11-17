import { getPosts } from '@/lib/posts'
import s from './blog.module.css'

export const metadata = {
  title: 'writing · s4way',
  description: 'notes from breaking servers, picking tools and fixing things. real numbers, no fluff.',
  alternates: { canonical: '/blog/' },
  openGraph: { url: '/blog/', title: 'writing · s4way' },
}

const short = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()

const SQUIGGLE = 'M8 46c12-14 20-14 26-2s14 12 22-2 16-14 22 0 14 12 22-2 12-12 18-4'

export default function Blog() {
  const posts = getPosts()
  const years = Object.entries(Object.groupBy(posts, (p) => p.date.slice(0, 4))).sort(([a], [b]) => b - a)

  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
      <header className="flex items-center justify-between">
        <a href="/" className="group flex items-center gap-3" aria-label="home">
          <img src="/img/newpfp.jpg" alt="" className="pfp h-9 w-9 rounded-full" />
          <span className="muted transition-colors group-hover:text-white">← s4way</span>
        </a>
        {posts.length > 0 && <p className="muted text-[13px] tabular-nums">{posts.length} posts</p>}
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">writing</h1>
        <p className="muted mt-1">notes from breaking servers, picking tools and fixing things. real numbers, no fluff.</p>
      </div>

      {posts.length ? (
        years.map(([year, list]) => (
          <section key={year}>
            <h2 className="muted mb-2 font-mono text-[13px]">{year}</h2>
            <ul className="-mx-3">
              {list.map((post) => (
                <li key={post.slug}>
                  <a href={`/blog/${post.slug}/`} className={`${s.post} group flex gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.04]`}>
                    <span className="muted w-14 shrink-0 pt-px font-mono text-[13px]">{short(post.date)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        {post.titleHtml ? (
                          <span className="font-medium" dangerouslySetInnerHTML={{ __html: post.titleHtml }} />
                        ) : (
                          <span className="font-medium">{post.title}</span>
                        )}
                        <span className={`${s.arrow} muted shrink-0 text-[13px]`}>{post.minutes} min →</span>
                      </span>
                      {post.description && <span className="muted mt-0.5 line-clamp-2 block text-[15px] leading-6">{post.description}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <section className="empty flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
          <svg className={s.scribble} width="140" height="64" viewBox="0 0 140 64" aria-hidden="true">
            <path className={s.line} d={SQUIGGLE} />
            <g className={s.pen}>
              <g transform="rotate(-38 0 0)">
                <rect x="-4.5" y="-30" width="9" height="24" rx="2.5" fill="#417dff" stroke="#fff" strokeWidth="2" />
                <rect x="-4.5" y="-34" width="9" height="6" rx="2" fill="#ffb3d9" stroke="#fff" strokeWidth="2" />
                <path d="M-4.5 -6 0 2 4.5 -6z" fill="#ffdcc7" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
              </g>
            </g>
          </svg>
          <p className="mt-4 text-lg font-medium">first post is cooking</p>
          <p className="muted mt-1 max-w-[340px]">nothing here yet. i'm busy breaking prod, but posts are coming.</p>
          <a href="https://discord.com/users/1338099754080665651" target="_blank" rel="noreferrer" className="link mt-5 text-[15px]">meanwhile, say hi on discord</a>
        </section>
      )}
    </main>
  )
}
