import Head from "next/head";
import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import Link from "next/link";

export interface PostFromPrismic {
  title: [{ text: string }];
  content: [{ text: string; type: string }];
}

interface Post {
  slug: string;
  updatedAt: string;
  title: string;
  excerpt: string;
}

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => {
            return (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                <a>
                  <time>{post.updatedAt}</time>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                </a>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query<PostFromPrismic>(
    Prismic.Predicates.at("document.type", "publication"),
    {
      fetch: ["publication.title", "publication.content"],
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      "pr-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
    title: post.data.title[0].text,
    excerpt:
      post.data.content.find((content) => content.type === "paragraph")?.text ??
      "",
  }));

  // console.log(JSON.stringify(response, null, 2));

  return {
    props: { posts },
  };
};
