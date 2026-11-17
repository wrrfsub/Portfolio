import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const DIR = path.join(process.cwd(), 'src/posts')

function niceDate(iso) {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toLowerCase()
}

function read(file) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8')
  const { data, content } = matter(raw)
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date).slice(0, 10)
  return {
    slug: file.replace(/\.md$/, ''),
    title: data.title,
    date,
    dateNice: niceDate(date),
    minutes: Math.max(1, Math.round(raw.split(/\s+/).length / 200)),
    description: data.description ?? '',
    titleHtml: data.titleHtml ?? null,
    content,
  }
}

export function getPosts() {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(read)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const render = (md) => marked.parse(md)
