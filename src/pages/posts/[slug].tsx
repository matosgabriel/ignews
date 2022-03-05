import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import { PostFromPrismic } from './index';

import styles from './post.module.scss';

interface Post {
  slug: string,
  updatedAt: string;
  title: string;
  content: string;
}

interface PostProps {
  post: Post;
}

function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>Post | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{ post.title }</h1>
          <time>{ post.updatedAt }</time>
          
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  );
}

export default Post;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  console.log(session);

  if (!session.activeSubscription) {
    return { 
      redirect: {
        destination: '/',
        permanent: false
      } 
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<PostFromPrismic>('publication', String(slug), {});

  const post = {
    slug,
    title: response.data.title[0].text,
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return { props: { post } }
}