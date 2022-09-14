import { screen, render } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";

import { createMock } from "ts-jest-mock";

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

const post = {
  slug: "new-post",
  title: "New post",
  content: "<p>Post excerpt</p>",
  updatedAt: "14 de setembro de 2022",
};

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("New post")).toBeInTheDocument();
  });

  it("redirects user if no subcription is found", async () => {
    const mockedGetSession = createMock(getSession);

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "new-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/posts/preview/new-post",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const mockedGetPrismicClient = createMock(getPrismicClient);
    const mockedGetSession = createMock(getSession);

    mockedGetPrismicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "New post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "09-14-2022",
      }),
    } as any);

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: "fake-subscription",
      expires: "fake-expires",
    });

    const response = await getServerSideProps({
      params: { slug: "new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "new-post",
            updatedAt: "14 de setembro de 2022",
            title: "New post",
            content: "<p>Post excerpt</p>",
          },
        },
      })
    );
  });
});
