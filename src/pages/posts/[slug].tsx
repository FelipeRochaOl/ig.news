import Head from "next/head";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from "next"
import { getSession } from "next-auth/react"
import { asHTML, asText } from "@prismicio/helpers";
import { formatDateFull } from "../../presenters";
import { createPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

type PostProps = InferGetServerSidePropsType<typeof getServerSideProps>
type ParamsProps = {
  slug: string;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.date}</time>
          {/* If necessary, look this https://prismic.io/docs/technologies/html-serializer */}
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps = async ({ req, previewData, params }: GetServerSidePropsContext<ParamsProps>) => {
  const session = await getSession({ req });
  const request = req as NextApiRequest;
  const slug = params?.slug || '';

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false
      }
    }
  }

  const prismic = createPrismicClient({ req: request, previewData });
  const response = await prismic.getByUID('post', slug);
  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content) ?? '',
    date: formatDateFull(response.last_publication_date)
  }

  return {
    props: {
      post
    }
  }
}