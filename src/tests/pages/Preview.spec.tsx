import { screen, render } from "@testing-library/react";
import Preview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { useSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";

import { createMock } from "ts-jest-mock";
import { useRouter } from "next/router";

jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock("next/router");

const post = {
  slug: "new-post",
  title: "New post",
  content: "<p>Post excerpt</p>",
  updatedAt: "14 de setembro de 2022",
};

describe("Post preview page", () => {
  it("renders correctly", () => {
    const mockedUseSession = createMock(useSession);

    mockedUseSession.mockReturnValueOnce({
      data: {},
    } as any);

    render(<Preview post={post} />);

    expect(screen.getByText("New post")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when is subscribed", async () => {
    const mockedUseSession = createMock(useSession);
    const mockedUseRouter = createMock(useRouter);
    const mockedPush = jest.fn();

    mockedUseSession.mockReturnValueOnce({
      data: { activeSubscription: "fake-subscription" },
    } as any);

    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush,
    } as any);

    render(<Preview post={post} />);

    expect(mockedPush).toHaveBeenCalledWith("/posts/new-post");
  });

  it("loads initial data", async () => {
    const mockedGetPrismicClient = createMock(getPrismicClient);

    mockedGetPrismicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "New post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "09-14-2022",
      }),
    } as any);

    const response = await getStaticProps({ params: { slug: "new-post" } });

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
