import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { GITHUB_AVATAR } from '@/lib/profile'

const desc = "hi, i'm shakti (s4way). self taught developer from nepal 🇳🇵, jr. swe at serveros, working in the hosting industry."

const SITE = 'https://www.s4-way.me'
const TITLE = 'shakti rimal (s4way)'

export const metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: desc,
  applicationName: 's4way',
  authors: [{ name: 'Shakti Rimal', url: SITE }],
  creator: 'Shakti Rimal',
  alternates: { canonical: '/' },
  icons: { icon: { url: GITHUB_AVATAR, type: 'image/jpeg' }, apple: GITHUB_AVATAR },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: 's4way',
    title: TITLE,
    description: desc,
    firstName: 'Shakti',
    lastName: 'Rimal',
    username: 's4way',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', creator: '@nyxx_s7', title: TITLE, description: desc, images: ['/og.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}

export const viewport = { themeColor: '#0a0a0a' }

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shakti Rimal',
  alternateName: 's4way',
  url: SITE,
  image: GITHUB_AVATAR,
  jobTitle: 'Junior Software Engineer',
  description: desc,
  worksFor: { '@type': 'Organization', name: 'ServerOS', url: 'https://serveros.com/' },
  address: { '@type': 'PostalAddress', addressLocality: 'Chitwan', addressCountry: 'NP' },
  knowsAbout: ['Linux', 'Web development', 'React', 'Next.js', 'Node.js', 'Laravel', 'Game server hosting', 'Pterodactyl'],
  sameAs: [
    'https://github.com/wrrfsub',
    'https://linkedin.com/in/shakti-rimal-a48aa13b2',
    'https://builtbybit.com/creators/s4way.652483/',
    'https://discord.com/users/1338099754080665651',
    'https://x.com/nyxx_s7',
  ],
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
    setTimeout(() => document.documentElement.classList.replace('building', 'built-page'), 8000)
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
        <script defer src="https://cloud.umami.is/script.js" data-website-id="8aa4bff7-534c-4407-8d5e-cbdf36647319" data-domains="www.s4-way.me,s4-way.me" />
        <noscript><style>{'.building [data-build] { opacity: 1 !important; }'}</style></noscript>
      </head>
      <body className="page-bg antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <div>{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
