import Link from 'next/link'
import Header from '../components/Header'
import { SessionProvider } from 'next-auth/react'
import { PrismicProvider } from '@prismicio/react'
import { IAppProps } from '../interfaces'

import '../styles/global.scss'

export default function App({ Component, pageProps: {session, ...pageProps} }: IAppProps) {
  return (
    <SessionProvider session={session}>
      <PrismicProvider internalLinkComponent={({ href, ...props }) => (
        <Link href={href}>
          <a {...props} />
        </Link>
      )}
    >
        <Header />
        <Component {...pageProps} />
      </PrismicProvider>
    </SessionProvider>
  )
}
