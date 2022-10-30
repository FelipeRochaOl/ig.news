import Link from 'next/link'
import { SessionProvider } from 'next-auth/react'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../services/prismic'
import { IAppProps } from './interfaces'
import Header from '../components/Header'

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
