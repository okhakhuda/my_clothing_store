import StoreProvider from './StoreProvider'
import './globals.scss'
import { inter, amaranth, philosopher } from './fonts/fonts.js'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Link from 'next/link'
import Head from 'next/head'
import { StoreProviderModalStatus } from './StoreProviderModalStatus'
import s from './page.module.scss'
import AppShell from './components/AppShell/AppShell'
import { makeStore } from './redux/store'

export const metadata = {
  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  metadataBase: new URL('https://vab-womans.vercel.app/'),
  title: 'VAB womans',
  description: 'Стильний, сучасний, вишуканий одяг для жінок',
  keywords: 'одяг, жінки, мода, стиль, сучасний одяг',
  authors: [{ name: 'VAB womans', url: 'https://github.com/VAB-womans' }],
  creator: 'VAB womans',
  openGraph: {
    title: 'VAB womans',
    description: 'Стильний, сучасний, вишуканий одяг для жінок',
    url: 'https://vab-womans.com',
    siteName: 'VAB womans',
    images: [
      {
        url: '/public/hero_tablet.webp',
        width: 1200,
        height: 630,
        alt: 'VAB womans - Стильний одяг для жінок',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${inter.variable} ${amaranth.variable} ${philosopher.variable}`}>
      <Head>
        <Link rel="icon shortcut apple" href="/icon.ico" />
      </Head>
      <body>
        <StoreProvider>
          <StoreProviderModalStatus>
            <main className={s.main}>{children}</main>
            <Footer />
          </StoreProviderModalStatus>
        </StoreProvider>
      </body>
    </html>
  )
}
