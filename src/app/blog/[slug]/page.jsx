import { notFound } from 'next/navigation'
import { getPosts, render } from '@/lib/posts'

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getPosts()
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }]
}

function find(slug) {
  const posts = getPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) notFound()
  return { ...posts[i], newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = getPosts().find((p) => p.slug === slug)
  return p ? { title: `${p.title} · s4way`, description: p.description } : {}
}

export default async function Post({ params }) {
  const data = find((await params).slug)
  return (
    <main className="mx-auto max-w-[660px] px-5 pb-36 pt-20 text-base leading-7">
      <a className="muted transition-colors hover:text-white" href="/blog/">← writing</a>
      <h1 className="mt-10 text-2xl font-semibold tracking-tight">
        {data.titleHtml ? <span dangerouslySetInnerHTML={{ __html: data.titleHtml }} /> : data.title}
      </h1>
      <p className="muted mt-2 font-mono text-[13px]">{data.dateNice} · {data.minutes} min read</p>
      <article className="post mt-10" dangerouslySetInnerHTML={{ __html: render(data.content) }} />

      {(data.older || data.newer) && (
        <nav className="mt-12 flex justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            {data.older && (
              <a className="group block" href={`/blog/${data.older.slug}/`}>
                <span className="muted font-mono text-[13px]">← older</span>
                <span className="mt-0.5 block font-medium group-hover:underline group-hover:underline-offset-2">{data.older.title}</span>
              </a>
            )}
          </div>
          <div className="text-right">
            {data.newer && (
              <a className="group block" href={`/blog/${data.newer.slug}/`}>
                <span className="muted font-mono text-[13px]">newer →</span>
                <span className="mt-0.5 block font-medium group-hover:underline group-hover:underline-offset-2">{data.newer.title}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </main>
  )
}
