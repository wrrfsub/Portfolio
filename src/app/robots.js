export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.s4-way.me/sitemap.xml',
    host: 'https://www.s4-way.me',
  }
}
