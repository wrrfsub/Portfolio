import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const desc = "hi, i'm shakti (s4way). self taught developer from nepal 🇳🇵, jr. swe at serveros, working in the hosting industry."

export const metadata = {
  title: 's4way',
  description: desc,
  icons: { icon: { url: '/img/newpfp.jpg', type: 'image/jpeg' } },
  openGraph: {
    type: 'website',
    title: 's4way',
    description: desc,
    images: [{ url: 'https://s4-way.me/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 's4way', description: desc, images: ['https://s4-way.me/og.png'] },
}

const boot = `
try {
  const th = localStorage.getItem('theme') || 'dark'
  document.documentElement.dataset.theme = th
  document.documentElement.classList.toggle('dark', th !== 'light')
} catch {}
const np = new Date(Date.now() + 345 * 60000)
if ((np.getUTCMonth() === 11 && np.getUTCDate() === 12) || location.search.includes('bday')) {
  document.documentElement.classList.add('bday-theme')
}
try {
  if (location.pathname === '/' && !sessionStorage.getItem('built') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('building')
    setTimeout(() => document.documentElement.classList.remove('building'), 8000)
  }
} catch {}
`

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&family=Caveat:wght@600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript><style>{'.building [data-build] { opacity: 1 !important; }'}</style></noscript>
      </head>
      <body className="page-bg antialiased">
        <div>{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
