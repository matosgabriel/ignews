import Head from 'next/head';
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time>26 de fevereiro de 2022</time>
            <strong>jQuery: a história da biblioteca JS mais usada da última década</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quam numquam, modi totam dignissimos quidem ad, eum qui ex accusamus inventore dolorum optio minus nulla. Reprehenderit doloribus deserunt veritatis illo!</p>
          </a>
          <a href="">
            <time>26 de fevereiro de 2022</time>
            <strong>jQuery: a história da biblioteca JS mais usada da última década</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quam numquam, modi totam dignissimos quidem ad, eum qui ex accusamus inventore dolorum optio minus nulla. Reprehenderit doloribus deserunt veritatis illo!</p>
          </a>
          <a href="">
            <time>26 de fevereiro de 2022</time>
            <strong>jQuery: a história da biblioteca JS mais usada da última década</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quam numquam, modi totam dignissimos quidem ad, eum qui ex accusamus inventore dolorum optio minus nulla. Reprehenderit doloribus deserunt veritatis illo!</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication'), {
      fetch: ['publication.title', 'publication.content'],
    }
  );

  console.log(JSON.stringify(response, null, 2));

  return {
    props: {}
  };
}