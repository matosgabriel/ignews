import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { createMock } from "ts-jest-mock";
import { useSession, signIn } from "next-auth/react";

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return { data: null, status: "unauthenticated" };
    },
    signIn: jest.fn(),
  };
});

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", async () => {
    const mockedSignIn = createMock(signIn);

    render(<SubscribeButton />);

    const subscribeButton = await screen.findByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(mockedSignIn).toHaveBeenCalled();
  });
});
