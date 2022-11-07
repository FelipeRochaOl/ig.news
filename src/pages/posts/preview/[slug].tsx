import { asHTML, asText } from "@prismicio/helpers";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { formatDateFull } from "../../../presenters";
import { createPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

type PostPreviewProps = InferGetStaticPropsType<typeof getStaticProps>
type ParamsProps = {
  slug: string;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, post.slug, router])

  return (
    <>
      <Head>
        <title>{`${post.title} | Ignews`}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.date}</time>
          {/* If necessary, look this https://prismic.io/docs/technologies/html-serializer */}
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticProps = async ({ params, previewData }: GetStaticPropsContext<ParamsProps>) => {
  const slug = params?.slug || '';
  const prismic = createPrismicClient({ previewData });
  const response = await prismic.getByUID('post', slug);
  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content.splice(0, 3)) ?? '',
    date: formatDateFull(response.last_publication_date)
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 // one hour
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking' 
    /* 
      true (Run in client - layout shift), 
      false (If not run, return 404),
      'blocking' (Run server side render, wait search post)
    */
  }
}