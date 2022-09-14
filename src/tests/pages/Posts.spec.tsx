import { screen, render } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

import { createMock } from "ts-jest-mock";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "new-post",
    title: "New post",
    excerpt: "Post excerpt",
    updatedAt: "14 de setembro",
  },
];

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("New post")).toBeInTheDocument();
  });

  it("loads inital data", async () => {
    const mockedGetPrismicClient = createMock(getPrismicClient);

    mockedGetPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "new-post",
            data: {
              title: [{ type: "heading", text: "New post" }],
              content: [{ type: "paragraph", text: "Post excerpt" }],
            },
            last_publication_date: "09-14-2022",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "new-post",
              updatedAt: "14 de setembro de 2022",
              title: "New post",
              excerpt: "Post excerpt",
            },
          ],
        },
      })
    );
  });
});
