import NoteMaker from '@/lib/NoteMaker'

export const metadata = {
  title: 'note maker · s4way',
  description: 'make handwritten arrow notes like the ones on s4-way.me. pick the text, arrow, color and tilt, then download it as svg, png or webp. free, runs in your browser.',
  alternates: { canonical: '/tools/note/' },
  openGraph: { url: '/tools/note/', title: 'note maker · s4way' },
}

export default function Note() {
  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-[30px] px-5 pb-36 pt-20 text-base leading-7">
      <a className="muted w-fit transition-colors hover:text-white" href="/tools/">← tools</a>
      <div>
        <h1 className="w-fit text-2xl font-semibold tracking-tight" style={{ viewTransitionName: 'tool-note' }}>note maker</h1>
        <p className="muted mt-1">make those little handwritten arrow notes from my site. svg, png or webp, all in your browser.</p>
      </div>
      <NoteMaker />
    </main>
  )
}
