import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { createMock } from "ts-jest-mock";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const mockedUseSession = createMock(useSession);

    mockedUseSession.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", async () => {
    const mockedSignIn = createMock(signIn);
    const mockedUseSession = createMock(useSession);

    mockedUseSession.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);

    const subscribeButton = await screen.findByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(mockedSignIn).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", async () => {
    const mockedUseRouter = createMock(useRouter);
    const mockedUseSession = createMock(useSession);
    const pushMock = jest.fn();

    mockedUseRouter.mockReturnValueOnce({
      push: pushMock,
    } as any);

    mockedUseSession.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        expires: "expires",
        activeSubscription: "subscription",
      },
      status: "authenticated",
    });

    const { debug } = render(<SubscribeButton />);

    const subscribeButton = await screen.findByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
    // expect(global.window.location.href).toContain("/posts");
  });
});
