import { getPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export default function sitemap() {
  const SITE = 'https://www.s4-way.me'
  return [
    { url: `${SITE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/blog/`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/tools/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/tools/note/`, changeFrequency: 'monthly', priority: 0.5 },
    ...getPosts().map((p) => ({ url: `${SITE}/blog/${p.slug}/`, lastModified: p.date, priority: 0.6 })),
  ]
}
