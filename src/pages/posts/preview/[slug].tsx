import { GetStaticPaths, GetStaticProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { getPrismicClient } from '../../../services/prismic';
import { RichText } from 'prismic-dom';

import { PostFromPrismic } from '../index';

import styles from '../post.module.scss';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface Post {
  slug: string,
  updatedAt: string;
  title: string;
  content: string;
}

interface PostPreviewProps {
  post: Post;
}

function PostPreview({ post }: PostPreviewProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, post.slug, router]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{ post.title }</h1>
          <time>{ post.updatedAt }</time>
          
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
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
  );
}

export default PostPreview;

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<PostFromPrismic>('publication', String(slug), {});

  const post = {
    slug,
    title: response.data.title[0].text,
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { post },
    revalidate: 60 * 30 // 30 minutes
  }
}