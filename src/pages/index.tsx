import type { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { SubscribeButton } from '../components/SubscribeButton';
import { formatPrice } from '../presenters';
import { stripe } from '../services/stripe';
import { IHomeProps } from './interfaces';

import styles from './styles.module.scss';

export default function Home({ product }: IHomeProps) {
  const {data: session} = useSession();
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    <main className={styles.contentContainer}>
      {session ? (
        <section className={styles.hero}>
          <span>👏 Hey, welcome {session.user?.name}</span>
          <h1>New about <br />the <span>React</span> world</h1>
          {session.activeSubscription ? (
            <>
              <p>
                Thank you for designated as news about<br />
                <span>react</span>, click in button to look
                the latest content from our <br />
                blog 🥰
              </p>
              <SubscribeButton priceId={product.priceId} text='Ignews posts'/>
            </>
          ) : (
            <>
              <p>
                Get access to all the publications <br />
                <span>for {product.amount} month</span>
              </p>
              <SubscribeButton priceId={product.priceId} text='Subscribe now'/>
            </>
          )}
        </section>
      ) : (
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>New about <br />the <span>React</span> world</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} text='Subscribe now'/>
        </section>
      )}
      <Image src="/images/avatar.svg" width="336" height="521" alt='Girl coding' />
    </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LwsM2AMjNtxbeO80ITWhvMF', {
    expand: ['product'] // get all data of product in stripe api
  });
  const product = {
    priceId: price.id,
    amount: formatPrice(price.unit_amount)
  }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}
