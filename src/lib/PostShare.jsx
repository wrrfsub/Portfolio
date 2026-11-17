'use client'
import { useEffect, useRef, useState } from 'react'
import s from './PostShare.module.css'

const enc = (t) => encodeURIComponent(t).replace(/-/g, '%2D').replace(/,/g, '%2C').replace(/&/g, '%26')
const track = (name, data) => window.umami?.track(name, data)
const isWord = (c) => !!c && /[\p{L}\p{N}]/u.test(c)

function fragment(range) {
  let words = range.toString().replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
  const { startContainer: sc, startOffset: so, endContainer: ec, endOffset: eo } = range
  if (words.length > 2 && sc.nodeType === 3 && isWord(sc.data[so - 1])) words = words.slice(1)
  if (words.length > 2 && ec.nodeType === 3 && isWord(ec.data[eo])) words = words.slice(0, -1)
  if (!words.length) return null
  return words.length > 8 ? `${enc(words.slice(0, 4).join(' '))},${enc(words.slice(-4).join(' '))}` : enc(words.join(' '))
}

export default function PostShare() {
  const [btn, setBtn] = useState(null)
  const [toast, setToast] = useState('')
  const range = useRef(null)
  const timer = useRef(0)

  const base = () => location.origin + location.pathname

  async function copy(url, msg) {
    try {
      await navigator.clipboard.writeText(url)
      setToast(msg)
    } catch {
      setToast("couldn't copy, the url bar has it")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 1800)
  }

  useEffect(() => {
    const article = document.querySelector('article.post')
    if (!article) return

    const onClick = (e) => {
      const a = e.target.closest('a.hlink')
      if (a && article.contains(a)) {
        copy(`${base()}${a.getAttribute('href')}`, 'link to this section copied')
        track('copy-link', { kind: 'section', section: a.getAttribute('href') })
      }
    }

    const check = () => {
      const sel = getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setBtn(null)
      const r = sel.getRangeAt(0)
      if (!article.contains(r.commonAncestorContainer) || r.toString().trim().length < 3) return setBtn(null)
      const rect = r.getBoundingClientRect()
      range.current = r.cloneRange()
      const below = rect.top < 60
      setBtn({ x: Math.min(Math.max(rect.left + rect.width / 2, 60), innerWidth - 60), y: below ? rect.bottom + 10 : rect.top - 10, below })
    }
    const later = () => setTimeout(check, 0)
    const onSelChange = () => getSelection()?.isCollapsed && setBtn(null)
    const hide = () => setBtn(null)

    const end = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      track('read', { post: location.pathname })
      end.disconnect()
    })
    if (article.lastElementChild) end.observe(article.lastElementChild)

    document.addEventListener('click', onClick)
    document.addEventListener('pointerup', later)
    document.addEventListener('keyup', later)
    document.addEventListener('selectionchange', onSelChange)
    addEventListener('scroll', hide, { passive: true })
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerup', later)
      document.removeEventListener('keyup', later)
      document.removeEventListener('selectionchange', onSelChange)
      removeEventListener('scroll', hide)
      end.disconnect()
    }
  }, [])

  function share() {
    const f = range.current && fragment(range.current)
    setBtn(null)
    if (f) {
      copy(`${base()}#:~:text=${f}`, 'link to this part copied')
      track('copy-link', { kind: 'text', post: location.pathname })
    }
  }

  return (
    <>
      {btn && (
        <button
          className={`${s.btn} ${btn.below ? s.below : ''}`}
          style={{ left: btn.x, top: btn.y }}
          onPointerDown={(e) => e.preventDefault()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={share}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          copy link
        </button>
      )}
      {toast && <div className={s.toast} role="status">{toast}</div>}
    </>
  )
}
