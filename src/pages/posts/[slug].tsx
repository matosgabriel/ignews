import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import { PostFromPrismic } from './index';

function Post() {
  const { query } = useRouter();
  const { slug } = query;
  
  console.log(slug);
  return (
    <>
      <Head>
        <title>Post | ig.news</title>
      </Head>
      <h1>Hello arthur</h1>
    </>
  );
}

export default Post;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<PostFromPrismic>('publication', String(slug), {});

  return { props: {} }
}