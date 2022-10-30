import Head from 'next/head';
import Link from 'next/link';
import { InferGetStaticPropsType } from 'next';
import { formatDateFull } from '../../presenters';
import { createPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

type PostProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Post({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        {posts.map(post => (
        <div key={post.id} className={styles.posts}>
          <Link href={`/posts/${post.slug}`}>
            <a>
              <time>{post.date}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          </Link>
        </div>))}
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const prismic = createPrismicClient();
  const response = await prismic.getAllByType('post');
  const posts = response.map(post => {
    return {
      id: post.id,
      slug: post.uid,
      title: post.data.title[0].text,
      excerpt: post.data.content.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
      date: formatDateFull(post.last_publication_date)
    }
  })
  return {
    props: {
      posts
    },
    revalidate: 60 * 60 * 24 // one day
  };
}